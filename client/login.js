document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      console.log('Response data:', data); // Log para verificar los datos
  
      if (response.ok) {
        alert(data.message);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role); // Almacenar el rol
  
        // Redirigir según el rol
        if (data.role === 'admin') {
          window.location.href = 'admin.html';
        } else if (data.role === 'client') {
          window.location.href = 'customer.html';
        } else {
          alert('Rol no reconocido');
        }
      } else {
        alert(data.message || 'Error en el inicio de sesión');
      }
    } catch (error) {
      console.error('Error durante el login:', error);
    }
  });
  