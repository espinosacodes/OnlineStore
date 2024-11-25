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

// Función para leer productos
function readProducts() {
    const data = fs.readFileSync(productsPath);
    return JSON.parse(data);
}

// Función para guardar productos
function writeProducts(products) {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
}

// Ruta para realizar una compra
router.post('/', (req, res) => {
    const { cart } = req.body;
    let products = readProducts();

    let total = 0;
    const items = cart.map(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (!product || product.quantity < cartItem.quantity) {
            throw new Error(`No hay suficiente stock de ${product.name}`);
        }
        total += product.price * cartItem.quantity;
        product.quantity -= cartItem.quantity; // Actualizar el stock
        return {
            name: product.name,
            quantity: cartItem.quantity,
            price: product.price
        };
    });

    // Actualizar el stock de productos
    writeProducts(products);

    const sales = readSales();
    const newSale = { id: sales.length + 1, total, items, date: new Date() };
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