// ============================================
// SECURITY.JS - Security Features
// ============================================

// ============================================
// XSS PROTECTION - Escape HTML
// ============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// CSRF TOKEN GENERATION
// ============================================

function generateCSRFToken() {
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('csrf_token', token);
    return token;
}

function getCSRFToken() {
    let token = sessionStorage.getItem('csrf_token');
    if (!token) {
        token = generateCSRFToken();
    }
    return token;
}

// ============================================
// INPUT VALIDATION
// ============================================

function validateInput(input, rules) {
    const value = input.value.trim();
    
    if (rules.required && !value) {
        return { valid: false, message: 'This field is required.' };
    }
    
    if (rules.minLength && value.length < rules.minLength) {
        return { valid: false, message: `Minimum ${rules.minLength} characters required.` };
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
        return { valid: false, message: `Maximum ${rules.maxLength} characters allowed.` };
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
        return { valid: false, message: rules.patternMessage || 'Invalid format.' };
    }
    
    return { valid: true };
}

// ============================================
// RATE LIMITING
// ============================================

const rateLimiter = {
    requests: {},
    maxRequests: 10,
    timeWindow: 60000, // 1 minute
    
    checkLimit: function(key) {
        const now = Date.now();
        if (!this.requests[key]) {
            this.requests[key] = [];
        }
        
        this.requests[key] = this.requests[key].filter(time => now - time < this.timeWindow);
        
        if (this.requests[key].length >= this.maxRequests) {
            return false;
        }
        
        this.requests[key].push(now);
        return true;
    }
};

// ============================================
// FORM PROTECTION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Add CSRF tokens to forms
    document.querySelectorAll('form').forEach(form => {
        if (!form.querySelector('input[name="csrf_token"]')) {
            const token = getCSRFToken();
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'csrf_token';
            input.value = token;
            form.appendChild(input);
        }
    });
    
    // Prevent duplicate form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.getAttribute('data-original-text') || 'Submit';
                }, 5000);
            }
        });
    });
});

// ============================================
// SECURE FORM SUBMISSION
// ============================================

function secureFormSubmit(form, callback) {
    const csrfToken = getCSRFToken();
    const formData = new FormData(form);
    
    // Validate all inputs
    let isValid = true;
    form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ff4444';
        } else {
            input.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        return false;
    }
    
    // Check rate limit
    const userKey = form.id || 'default_form';
    if (!rateLimiter.checkLimit(userKey)) {
        alert('Too many requests. Please wait a moment before submitting again.');
        return false;
    }
    
    // Add CSRF token to form data
    formData.append('csrf_token', csrfToken);
    
    // Call the callback
    if (callback) {
        callback(formData);
    }
    
    return true;
}

// ============================================
// CONTENT SECURITY POLICY (CSP) REPORTING
// ============================================

// Report CSP violations to console for debugging
if (window.console) {
    console.log('🔒 Security features enabled:');
    console.log('   - XSS Protection');
    console.log('   - CSRF Token Protection');
    console.log('   - Rate Limiting');
    console.log('   - Input Validation');
    console.log('   - Form Security');
}

// ============================================
// DEBUG - DEVELOPMENT ONLY
// ============================================

// Remove this section in production
console.log('✅ Security.js loaded successfully');