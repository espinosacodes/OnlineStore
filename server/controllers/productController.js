const fs = require('fs');
const { verifyToken } = require('../middleware/authMiddleware');

// Leer y escribir JSON
const readJSON = (file) => JSON.parse(fs.readFileSync(file));
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data));

// Agregar producto
exports.addProduct = (req, res) => {
    const { name, description, price, quantity } = req.body;
    const products = readJSON('./models/products.json');
    
    products.push({ name, description, price, quantity });
    writeJSON('./models/products.json', products);

    res.json({ message: 'Product added' });
};

// Ver productos
exports.getProducts = (req, res) => {
    const products = readJSON('./models/products.json');
    res.json(products);
};


