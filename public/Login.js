//login.js

const form = document.getElementById('form_login');
const usernameField = document.getElementById('text_username');
const passwordField = document.getElementById('password_user_password');
//const errorMessage = document.getElementById('p_login_error_message');

async function sendLoginRequest(username, password) {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        return data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

function handleLogin() {
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = usernameField.value;
        const password = passwordField.value;

        try {
            const data = await sendLoginRequest(username, password);
            
            if (data.success) {
                // redirect to homePage
                // currently just alerting the user
                alert(data.message);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error)
            alert(error);
        }
    
        
    });
}

if (form && usernameField && passwordField) {
    handleLogin();
}