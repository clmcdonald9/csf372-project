const FORM = document.getElementById('form_login');
const USERNAME_FIELD = document.getElementById('text_username');
const PASSWORD_FIELD = document.getElementById('password_user_password');

async function sendLoginRequest(username, password) {
    try {
        const response = await fetch('/auth/login', {
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
    FORM.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = USERNAME_FIELD.value;
        const password = PASSWORD_FIELD.value;

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

if (FORM && USERNAME_FIELD && PASSWORD_FIELD) {
    handleLogin();
}