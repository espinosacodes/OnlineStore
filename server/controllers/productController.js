const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../middleware/authMiddleware');

// Leer y escribir JSON con rutas absolutas
const readJSON = (file) => JSON.parse(fs.readFileSync(path.join(__dirname, file)));
const writeJSON = (file, data) => fs.writeFileSync(path.join(__dirname, file), JSON.stringify(data, null, 2));

// Modifica las funciones para usar las nuevas rutas
exports.getProducts = (req, res) => {
    const products = readJSON('../models/products.json');
    res.json(products);
};

exports.addProduct = (req, res) => {
    const products = readJSON('../models/products.json');
    const { name, description, price, quantity } = req.body;
    products.push({ name, description, price, quantity });
    writeJSON('../models/products.json', products);
    res.json({ message: 'Product added' });
};



