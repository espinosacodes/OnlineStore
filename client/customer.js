document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCart();
    loadPurchaseHistory();

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    });

    document.getElementById('purchase').addEventListener('click', async () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        try {
            const response = await fetch('/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cart }),
            });

            if (response.ok) {
                localStorage.removeItem('cart');
                loadCart();
                loadPurchaseHistory();
                loadProducts(); // Recargar productos para actualizar cantidades
                alert('Compra realizada con éxito');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al realizar la compra:', error);
            alert('Error al realizar la compra');
        }
    });
});

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        const productList = document.getElementById('productList');
        productList.innerHTML = '';

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <h3>${product.name}</h3>
                <p>Descripción: ${product.description}</p>
                <p>Precio: $${product.price}</p>
                <p>Cantidad disponible: ${product.quantity}</p>
                <button onclick="addToCart(${product.id})">Añadir al carrito</button>
            `;
            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error('Error al cargar los productos', error);
    }
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    alert('Producto añadido al carrito');
}

async function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = '';

    if (cart.length === 0) {
        cartList.innerHTML = '<p>El carrito está vacío</p>';
        return;
    }

    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        let total = 0;
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const itemTotal = product.price * item.quantity;
                total += itemTotal;
                const cartItem = document.createElement('div');
                cartItem.innerHTML = `
                    <p>${product.name} - Cantidad: ${item.quantity} - Precio: $${itemTotal}</p>
                    <button onclick="removeFromCart(${item.id})">Eliminar</button>
                `;
                cartList.appendChild(cartItem);
            }
        });

        const totalElement = document.createElement('div');
        totalElement.innerHTML = `<strong>Total del carrito: $${total}</strong>`;
        cartList.appendChild(totalElement);
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

async function loadPurchaseHistory() {
    try {
        const response = await fetch('/api/sales/history');
        const history = await response.json();

        const purchaseHistory = document.getElementById('purchaseHistory');
        purchaseHistory.innerHTML = '';

        history.forEach(purchase => {
            const purchaseItem = document.createElement('div');
            purchaseItem.innerHTML = `
                <h4>Compra ID: ${purchase.id}</h4>
                <p>Total: $${purchase.total.toFixed(2)}</p>
                <p>Productos: ${purchase.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</p>
            `;
            purchaseHistory.appendChild(purchaseItem);
        });
    } catch (error) {
        console.error('Error al cargar el historial de compras:', error);
    }
}

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      alert('Login successful');
      
      // Check the user's role and redirect accordingly
      const userRole = parseJwt(data.token).role;
      if (userRole === 'admin') {
        window.location.href = '/admin.html';
      } else {
        window.location.href = '/customer.html';
      }
    } else {
      alert(data.message);
    }
  });

  // Function to parse JWT token
  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';
const usersFilePath = path.join(__dirname, '../models/users.json');

// Utility functions to read/write users
function readUsers() {
  try {
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users.json:', error);
    return [];
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing to users.json:', error);
  }
}

// Registration route
router.post('/register', async (req, res) => {
  const { username, password, role = 'client' } = req.body;
  const users = readUsers();

  // Check if an admin already exists
  if (role === 'admin') {
    const adminExists = users.some((user) => user.role === 'admin');
    if (adminExists) {
      return res.status(400).json({ message: 'An admin already exists.' });
    }
  }

  // Check if the user already exists
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password and save the new user with their role
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashedPassword, role };
  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: 'User registered successfully' });
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(403).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(403).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

// Protected route
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Access granted to protected route', user: req.user });
});

// Admin route
router.get('/admin', verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: 'Access granted to admin route' });
});

module.exports = router;