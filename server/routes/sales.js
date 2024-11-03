const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const salesPath = path.join(__dirname, '../models/sales.json');

// Función para leer el archivo de ventas
function readSales() {
    const data = fs.readFileSync(salesPath);
    return JSON.parse(data);
}

// Función para escribir en el archivo de ventas
function writeSales(sales) {
    fs.writeFileSync(salesPath, JSON.stringify(sales, null, 2));
}

// Ruta para realizar una compra
router.post('/', (req, res) => {
    const { items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'El carrito está vacío' });
    }

    const sales = readSales();
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newSale = {
        id: sales.length + 1,
        date: new Date().toISOString(),
        items,
        total,
    };

    sales.push(newSale);
    writeSales(sales);

    res.status(201).json({ message: 'Compra realizada exitosamente' });
});

// Ruta para obtener el historial de compras
router.get('/history', (req, res) => {
    const sales = readSales();
    res.json(sales);
});

module.exports = router;
