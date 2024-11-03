const fs = require('fs');
const path = require('path');
const productsPath = path.join(__dirname, '../models/products.json');

// Función para leer los productos
function readProducts() {
    const data = fs.readFileSync(productsPath);
    return JSON.parse(data);
}

// Función para escribir productos
function writeProducts(products) {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
}

// Controlador para obtener todos los productos
exports.getProducts = (req, res) => {
    const products = readProducts();
    res.json(products);
};

// Controlador para agregar un nuevo producto
exports.addProduct = (req, res) => {
    const { name, description, price, quantity } = req.body;

    if (!name || !description || !price || !quantity) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const products = readProducts();
    const newProduct = {
        id: products.length + 1,
        name,
        description,
        price,
        quantity,
    };

    products.push(newProduct);
    writeProducts(products);

    res.status(201).json({ message: 'Producto agregado exitosamente' });
};
