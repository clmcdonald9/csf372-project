const USERNAME_FORM = document.getElementById('form_username');
const NEW_PASSWORD_FORM = document.getElementById('form_new_password');

const USERNAME_FIELD = document.getElementById('text_username');

const SECURITY_QUESTION_1 = document.getElementById('text_security_question_1');
const SECURITY_QUESTION_2 = document.getElementById('text_security_question_2');

const SECURITY_ANSWER_1 = document.getElementById('text_security_answer_1');
const SECURITY_ANSWER_2 = document.getElementById('text_security_answer_2');

const NEW_PASSWORD_FIELD = document.getElementById('password_new_password');
const PASSWORD_HINTS = document.getElementById('p_password_hints');

// Regular expression to validate username and password: 
// 8-16 characters, at least one lowercase letter, one uppercase letter,
//  one digit, and one special character (!@#$%^&*?_.).
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_.])[a-zA-Z0-9!@#$%^&*?_.]{8,16}$/;

async function securityQuestionsRequest(username) {
    // This function will make an API call to the server to get the security questions for the given username.
    try {
        const response = await fetch('/auth/security-questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to retrieve security questions');
        }

        if (!data.questions || data.questions.length < 2) {
            throw new Error('Not enough security questions found for this user');
        }

        SECURITY_QUESTION_1.textContent = data.questions[0].question;
        SECURITY_QUESTION_2.textContent = data.questions[1].question;

        NEW_PASSWORD_FORM.style.display = 'block';

    } catch (error) {
        console.error('Error retrieving security questions:', error);
        alert(error.message);
    }


}

function handleUsernameSubmission() {
    FORM.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = USERNAME_FIELD.value;

        securityQuestionsRequest(username);
    });

}
function validateSecurityAnswers() {
    // this function will validate the security answers against the answers stored in the database for the given username.
}

function validateNewPassword() {
    // this function will validate new password against the PASSWORD_REGEX
}


if (USERNAME_FORM && USERNAME_FIELD) {
    handleUsernameSubmission();
}

if (NEW_PASSWORD_FORM && SECURITY_ANSWER_1 && SECURITY_ANSWER_2 && NEW_PASSWORD_FIELD) {
    validateSecurityAnswers();
    validateNewPassword();
}