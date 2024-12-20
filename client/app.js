const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configura Express para servir archivos estáticos desde la carpeta client
app.use('/cliente', express.static(path.join(__dirname, '../client')));

// Configura tus rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Mostrar formulario de registro
function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

// Mostrar formulario de inicio de sesión
function showLoginForm() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Función de registro
function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;

    fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        showLoginForm(); // Mostrar el formulario de inicio de sesión después de registrarse
    })
    .catch(error => console.error('Error during registration:', error));
}

// Función de inicio de sesión
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response data:', data);  // Agrega un log para verificar la respuesta
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            if (data.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'customer.html';
            }
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error during login:', error));
}

// Mostrar productos solo si el usuario está autenticado
function showProducts() {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in first');

    fetch('http://localhost:3000/api/products', {
        headers: { 'Authorization': token }
    })
    .then(response => response.json())
    .then(data => {
        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; // Limpiar productos anteriores

        data.forEach(product => {
            const productElem = document.createElement('div');
            productElem.classList.add('product-item');
            productElem.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                <p>Quantity: ${product.quantity}</p>
            `;
            productList.appendChild(productElem);
        });

        // Mostrar productos y ocultar formularios
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('products').style.display = 'block';
    })
    .catch(error => console.error('Error fetching products:', error));
}



// Login handler en tu JavaScript del cliente
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response data:', data);  // Agrega un log para verificar la respuesta
        if (data.token) {
            localStorage.setItem('token', data.token);  // Guarda el token
            localStorage.setItem('role', data.role);    // Guarda el rol del usuario
            alert('Login exitoso');

            // Redirige según el rol
            if (data.role === 'admin') {
                console.log('Redirigiendo a la página del administrador');  // Log para verificar la redirección
                window.location.href = '/client/admin.html';  // Página del administrador
            } else if (data.role === 'client') {
                console.log('Redirigiendo a la página del cliente');  // Log para verificar la redirección
                window.location.href = '/client/customer.html';  // Página del cliente
            }
        } else {
            alert('Error en el login');
        }
    })
    .catch(error => console.error('Error:', error));
});
