// Check if user is logged in
if (!localStorage.getItem('user')) {
    window.location.href = 'index.html';
}

document.getElementById('logout').addEventListener('click', function() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});