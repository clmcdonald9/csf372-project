const ACCOUNT_SETUP_FORM = document.getElementById('form_account_setup');

const SECURITY_QUESTION_1 = document.getElementById('text_question_1');
const SECURITY_QUESTION_2 = document.getElementById('text_question_2');

const SECURITY_ANSWER_1 = document.getElementById('text_answer_1');
const SECURITY_ANSWER_2 = document.getElementById('text_answer_2');

const NEW_PASSWORD_FIELD = document.getElementById('password_new_password');

const REQUIRED_FIELDS = [
    ACCOUNT_SETUP_FORM && 
    SECURITY_QUESTION_1 && 
    SECURITY_QUESTION_2 && 
    SECURITY_ANSWER_1 && 
    SECURITY_ANSWER_2 && 
    NEW_PASSWORD_FIELD
];

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_.])[a-zA-Z0-9!@#$%^&*?_.]{8,16}$/;


async function updateAccountData(username) {
    try {
        const response = await fetch('auth/update-user-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                question1: SECURITY_QUESTION_1.value,
                question2: SECURITY_QUESTION_2.value,
                answer1: SECURITY_ANSWER_1.value,
                answer2: SECURITY_ANSWER_2.value,
                newPassword: NEW_PASSWORD_FIELD.value
            })
        });

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update user account');
        }

    } catch (error) {
        console.error('Error updating user account:', error);
        alert(error.message);
    }
}

async function getUsername() {
    try {
        const response = await fetch('/auth/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to retrieve user information');
        }

        return data.user.username;

    } catch (error) {
        console.error('Error retrieving user information:', error);
        throw error;
    }

}

function newAccountSetup() {
    ACCOUNT_SETUP_FORM.addEventListener('submit', async function(event) {
        event.preventDefault();

        try {
            if (!PASSWORD_REGEX.test(NEW_PASSWORD_FIELD.value)) {
                alert('Password does not meet the required criteria');
                throw new Error('Password does not meet the required criteria');
            }

            const username = await getUsername();
            await updateAccountData(username);

            alert('Account setup complete! Please log in with your new password.');
            window.location.href = 'Login.html';
        } catch (error) {
            console.error('Error during account setup:', error);
            alert(error.message);
        }
    });
}

if (REQUIRED_FIELDS.every(field => field)) {
    newAccountSetup();
}