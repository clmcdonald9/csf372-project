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
            
            if (!data.success) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.user.firstLogin) {
                window.location.href = 'NewUser.html';
            } else {
                window.location.href = 'Gallery.html';
            }
        } catch (error) {
            console.log(error)
            alert(error.message);
        }
    
        
    });
}

if (FORM && USERNAME_FIELD && PASSWORD_FIELD) {
    handleLogin();
}