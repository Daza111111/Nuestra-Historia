document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple validation - in a real app, this should be more secure
    if ((username === 'oscar' && password === 'amor123') || 
        (username === 'yuritzi' && password === 'amor123')) {
        localStorage.setItem('user', username);
        window.location.href = 'home.html';
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});