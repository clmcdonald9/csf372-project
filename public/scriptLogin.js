const form = document.getElementById('loginForm');
const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');
const errorMessage = document.getElementById('text_login_error_message');

// Regular expression to validate username and password: 
// 8-16 characters, at least one lowercase letter, one uppercase letter,
//  one digit, and one special character (!@#$%^&*?_.).
const loginRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_.])[a-zA-Z0-9!@#$%^&*?_.]{8,16}$/;

form.addEventListener('submit', function(event) { 
    errorMessage.style.display = 'none';

    const username = usernameField.value;
    const password = passwordField.value;

    if (!loginRegex.test(username) || !loginRegex.test(password)) { 
        event.preventDefault();
        errorMessage.style.display = 'block';
    }
});