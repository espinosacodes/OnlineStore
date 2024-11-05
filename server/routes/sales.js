const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const salesPath = path.join(__dirname, '../models/sales.json');
const productsPath = path.join(__dirname, '../models/products.json');

// Función para leer las ventas
function readSales() {
    const data = fs.readFileSync(salesPath);
    return JSON.parse(data);
}

// Función para guardar ventas
function writeSales(sales) {
    fs.writeFileSync(salesPath, JSON.stringify(sales, null, 2));
}

// Ruta para realizar una compra
router.post('/', (req, res) => {
    const { cart } = req.body;
    const products = JSON.parse(fs.readFileSync(productsPath));

    const items = cart.map(productId => products.find(p => p.id === productId));
    const total = items.reduce((sum, item) => sum + item.price, 0);

    const sales = readSales();
    const newSale = { id: sales.length + 1, total, items };
    sales.push(newSale);
    writeSales(sales);

    res.status(201).json({ message: 'Compra realizada exitosamente', sale: newSale });
});

// Ruta para ver el historial de compras
router.get('/history', (req, res) => {
    const sales = readSales();
    res.json(sales);
});

module.exports = router;