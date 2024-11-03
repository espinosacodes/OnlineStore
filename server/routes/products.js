const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../models/products.json');

// Función para leer el archivo de productos
function readProducts() {
    const data = fs.readFileSync(productsPath);
    return JSON.parse(data);
}

// Función para escribir en el archivo de productos
function writeProducts(products) {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
}

// Ruta para obtener la lista de productos
router.get('/', (req, res) => {
    const products = readProducts();
    res.json(products);
});

// Ruta para agregar un nuevo producto
router.post('/', (req, res) => {
    const { name, description, price, quantity } = req.body;

    if (!name || !description || !price || !quantity) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const products = readProducts();
    const newProduct = { id: products.length + 1, name, description, price, quantity };
    products.push(newProduct);

    writeProducts(products);

    res.status(201).json({ message: 'Producto agregado exitosamente' });
});

module.exports = router;
