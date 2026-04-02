const form = document.getElementById('form_passwordReset');
const usernameField = document.getElementById('text_username');
const passwordField = document.getElementById('password_new_password');
const errorMessage = document.getElementById('p_password_error_message');

// Regular expression to validate username and password: 
// 8-16 characters, at least one lowercase letter, one uppercase letter,
//  one digit, and one special character (!@#$%^&*?_.).
const loginRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_.])[a-zA-Z0-9!@#$%^&*?_.]{8,16}$/;


// Not sure this will be necessary for ordinary users,other than when resetting password. 
// but eventually maybe this can be used when an admin creates a new user account?
if (form) {
    
    form.addEventListener('submit', function(event) { 
        errorMessage.style.display = 'none';

        const username = usernameField.value;
        const password = passwordField.value;

        if (!loginRegex.test(username) || !loginRegex.test(password)) { 
            event.preventDefault();
            errorMessage.style.display = 'block';
        }
    });
}