const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const router = express.Router();
const verifyToken = require('./middleware/authMiddleware').verifyToken;

app.use(cors());
app.use(express.json());

// server/app.js
const purchasesRouter = require('./routes/purchases');
app.use('/api', purchasesRouter);

// Rutas de API
app.use('/api/auth', require('./routes/auth'));  // assuming authMiddleware.js is in routes/auth.js
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));

// Sirviendo archivos estáticos desde la carpeta "client"
app.use(express.static(path.join(__dirname, '../client')));

// Ruta principal para redirigir a "index.html" si se accede a la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'customer.html'));
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

// Ruta para obtener el historial de compras del usuario
router.get('/purchase/history', verifyToken, (req, res) => {
    const purchases = purchasesRouter.readPurchases();
    const userPurchases = purchases.filter(purchase => purchase.user === req.user.username);
    res.json(userPurchases);
});

app.use(router);