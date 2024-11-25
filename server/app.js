const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas de API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));

// Sirviendo archivos estáticos desde la carpeta "client"
app.use(express.static(path.join(__dirname, '../client')));

// Ruta principal para redirigir a "index.html" si se accede a la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// Rutas específicas para acceder a las páginas de cliente y administrador
app.get('/cliente/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'admin.html'));
});

//TODO:  revisar creo que esta ya se puede borrar 
app.get('/cliente/customer', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'customer.html'));
});

// Si accedes a '/cliente', servirá 'customer.html' desde el cliente
app.get('/cliente', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'customer.html'));
});

// Iniciando el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});


