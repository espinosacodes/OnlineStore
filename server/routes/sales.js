// server/routes/sales.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Importar el middleware de autenticación
const { verifyToken } = require('../middleware/auth');

const salesPath = path.join(__dirname, '../models/sales.json');
const productsPath = path.join(__dirname, '../models/products.json');

// Función para leer las ventas
function readSales() {
    try {
        const data = fs.readFileSync(salesPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer sales.json:', error);
        return [];
    }
}

// Función para guardar ventas
function writeSales(sales) {
    try {
        fs.writeFileSync(salesPath, JSON.stringify(sales, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al escribir en sales.json:', error);
    }
}

// Función para leer productos
function readProducts() {
    try {
        const data = fs.readFileSync(productsPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer products.json:', error);
        return [];
    }
}

// Función para guardar productos
function writeProducts(products) {
    try {
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al escribir en products.json:', error);
    }
}

// Ruta para realizar una compra
router.post('/', verifyToken, (req, res) => {
    try {
        const userId = req.user.id; // Obtener el ID del usuario desde el token
        const { cart } = req.body;

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío' });
        }

        let products = readProducts();

        let total = 0;
        const items = cart.map(cartItem => {
            const product = products.find(p => p.id === cartItem.id);
            if (!product) {
                throw new Error(`Producto con ID ${cartItem.id} no encontrado`);
            }
            if (product.quantity < cartItem.quantity) {
                throw new Error(`No hay suficiente stock de ${product.name}`);
            }
            total += parseFloat(product.price) * cartItem.quantity;
            product.quantity -= cartItem.quantity; // Actualizar el stock
            return {
                id: product.id,
                name: product.name,
                description: product.description,
                price: parseFloat(product.price),
                quantity: cartItem.quantity
            };
        });

        // Actualizar el stock de productos
        writeProducts(products);

        const sales = readSales();
        const newSale = { 
            id: sales.length + 1, 
            userId, 
            total: total.toFixed(2), 
            items, 
            date: new Date().toISOString() 
        };
        sales.push(newSale);
        writeSales(sales);

        res.status(201).json({ message: 'Compra realizada exitosamente', sale: newSale });
    } catch (error) {
        console.error('Error al procesar la compra:', error.message);
        res.status(400).json({ message: error.message });
    }
});

// Ruta para ver el historial de compras
router.get('/history', verifyToken, (req, res) => {
    try {
        const userId = req.user.id; // Obtener el ID del usuario desde el token

        const sales = readSales();

        // Filtrar las ventas por userId
        const userSales = sales.filter(sale => sale.userId === userId);

        res.json(userSales);
    } catch (error) {
        console.error('Error al obtener el historial de compras:', error.message);
        res.status(500).json({ message: 'Error al obtener el historial de compras' });
    }
});

module.exports = router;
