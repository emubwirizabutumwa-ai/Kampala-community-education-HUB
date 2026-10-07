const bcrypt = require('bcrypt');
const pool = require('./db');

async function createAdmin() {
    const username = 'admin';
    const email = 'admin@kceh.org';
    const password = 'ChangeMe123!';

    try {
        const passwordHash = await bcrypt.hash(password, 12);

        await pool.query(
            `INSERT INTO admins (username, email, password_hash)
             VALUES (?, ?, ?)`,
            [username, email, passwordHash]
        );

        console.log('Admin account created successfully.');
        console.log('Username:', username);
        console.log('Password:', password);

    } catch (error) {
        console.error('Failed to create admin:', error.message);
    } finally {
        await pool.end();
    }
}

createAdmin();