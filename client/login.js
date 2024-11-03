
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
        alert(data.message);
        
        if (data.role === 'Administrador') {
            window.location.href = 'admin.html';
        } else if (data.role === 'Cliente') {
            window.location.href = 'customer.html';
        }
    } else {
        alert(data.message || 'Error en el inicio de sesión');
    }
});
