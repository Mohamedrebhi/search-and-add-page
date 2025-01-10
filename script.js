// Predefined credentials
const CORRECT_USERNAME = "admin";
const CORRECT_PASSWORD = "password123";

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
        // Successful login
        errorMessage.textContent = '';
        window.location.href = 'welcome.html';
    } else {
        // Failed login
        errorMessage.textContent = 'Invalid username or password';
    }
});
