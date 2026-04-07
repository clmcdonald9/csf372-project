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

function getSecurityQuestions(username, question_field_1, question_field_2) {
    // This function will make an API call to the server to get the security questions for the given username.
}

function validateNewPassword(new_password_field) {
    // this function will validate new password against the PASSWORD_REGEX
}

function validateSecurityAnswers(security_answer_1, security_answer_2) {
    // this function will validate the security answers against the answers stored in the database for the given username.
}

if (USERNAME_FORM && USERNAME_FIELD) {    
    getSecurityQuestions(USERNAME_FIELD, SECURITY_QUESTION_1, SECURITY_QUESTION_2);
}

if (NEW_PASSWORD_FORM && SECURITY_ANSWER_1 && SECURITY_ANSWER_2 && NEW_PASSWORD_FIELD) {
    validateSecurityAnswers(SECURITY_ANSWER_1, SECURITY_ANSWER_2);
    validateNewPassword(NEW_PASSWORD_FIELD);
}