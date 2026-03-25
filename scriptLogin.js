const form = document.getElementById('loginForm');
const usernameField = document.getElementById('username');
const errorMessage = document.getElementById('errorMessage');

const usernameRegex = /^[a-zA-Z]+$/; // This only allows for characters aA-zZ. 


form.addEventListener('submit', function(event) { // Handles form submission.

    errorMessage.style.display = 'none'; // Clears any previous error messages.

    const username = usernameField.value; // Get the username value,

    if (!usernameRegex.test(username)) { // thenb test if it matches the regular expression var.       
        event.preventDefault(); // Prevent form submission and show error if it does.
        errorMessage.style.display = 'block';
    }
});