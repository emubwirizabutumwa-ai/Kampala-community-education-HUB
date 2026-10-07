const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const pool = require('./db');

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session authentication
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'kceh-development-secret-change-this',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // false for localhost development
            maxAge: 1000 * 60 * 60 // 1 hour
        }
    })
);

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));


// ==========================================
// CONTACT FORM
// ==========================================

app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.'
        });
    }

    try {
        await pool.query(
            `INSERT INTO contact_messages
            (name, email, subject, message)
            VALUES (?, ?, ?, ?)`,
            [name, email, subject, message]
        );

        res.json({
            success: true,
            message: 'Message sent successfully! We will get back to you soon.'
        });

    } catch (err) {
        console.error('Contact form error:', err);

        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
});


// ==========================================
// VOLUNTEER FORM
// ==========================================

app.post('/api/volunteer', async (req, res) => {
    const {
        full_name,
        email,
        phone,
        skills,
        availability,
        reason
    } = req.body;

    if (!full_name || !email || !skills || !availability) {
        return res.status(400).json({
            success: false,
            message: 'Please fill in all required fields.'
        });
    }

    try {
        await pool.query(
            `INSERT INTO volunteers
            (full_name, email, phone, skills, availability, reason)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                full_name,
                email,
                phone || null,
                skills,
                availability,
                reason || null
            ]
        );

        res.json({
            success: true,
            message: 'Thank you for registering! We will contact you soon.'
        });

    } catch (err) {
        console.error('Volunteer form error:', err);

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'This email has already been registered.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
});


// ==========================================
// ADMIN LOGIN
// ==========================================

app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;

    // Check that both fields were provided
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required.'
        });
    }

    try {
        // Find the administrator
        const [rows] = await pool.query(
            `SELECT id, username, email, password_hash
             FROM admins
             WHERE username = ?
             LIMIT 1`,
            [username]
        );

        // Admin does not exist
        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password.'
            });
        }

        const admin = rows[0];

        // Compare entered password with bcrypt hash
        const passwordMatches = await bcrypt.compare(
            password,
            admin.password_hash
        );

        // Password is wrong
        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password.'
            });
        }

        // Login successful
        req.session.adminId = admin.id;
        req.session.adminUsername = admin.username;
        req.session.adminEmail = admin.email;

        res.json({
            success: true,
            message: 'Login successful.',
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);

        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        });
    }
});


// ==========================================
// CHECK ADMIN LOGIN
// ==========================================

app.get('/api/admin/me', (req, res) => {

    // No session = not logged in
    if (!req.session.adminId) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated.'
        });
    }

    // Session exists
    res.json({
        success: true,
        admin: {
            id: req.session.adminId,
            username: req.session.adminUsername,
            email: req.session.adminEmail
        }
    });
});


// ==========================================
// ADMIN LOGOUT
// ==========================================

app.post('/api/admin/logout', (req, res) => {

    req.session.destroy((error) => {

        if (error) {
            console.error('Logout error:', error);

            return res.status(500).json({
                success: false,
                message: 'Could not log out.'
            });
        }

        // Remove the session cookie
        res.clearCookie('connect.sid');

        res.json({
            success: true,
            message: 'Logged out successfully.'
        });
    });
});


// ==========================================
// TEST MYSQL CONNECTION
// ==========================================

pool.getConnection()
    .then(connection => {
        console.log('MySQL database connected successfully.');
        connection.release();
    })
    .catch(error => {
        console.error(
            'MySQL connection failed:',
            error.message
        );
    });


// ==========================================
// server side protection 
// =======================================

    function requireAdmin(req, res, next) {
    if (!req.session.adminId) {
        return res.status(401).json({
            success: false,
            message: 'Administrator authentication required.'
        });
    }

    next();
}


// ==========================================
// START SERVER
// ==========================================

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});