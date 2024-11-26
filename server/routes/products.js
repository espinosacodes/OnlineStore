const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

const productsFilePath = path.join(__dirname, '../models/products.json');

// Utility functions to read/write products
function readProducts() {
  try {
    if (!fs.existsSync(productsFilePath)) {
      fs.writeFileSync(productsFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products.json:', error);
    return [];
  }
}

function writeProducts(products) {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error writing to products.json:', error);
  }
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Get all products
router.get('/', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Add a new product (admin only)
router.post('/add', verifyToken, verifyAdmin, upload.single('image'), (req, res) => {
  const { name, description, price, quantity } = req.body;
  const products = readProducts();

  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price,
    quantity: parseInt(quantity, 10),
    imageUrl: req.file ? `server/uploads/${req.file.filename}` : null,
  };

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json({ message: 'Product added successfully', product: newProduct });
});

// Delete a product (admin only)
router.delete('/:id', verifyToken, verifyAdmin, (req, res) => {
  const { id } = req.params;
  let products = readProducts();
  const productIndex = products.findIndex((product) => product.id === parseInt(id, 10));

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(productIndex, 1);
  writeProducts(products);

  res.json({ message: 'Product deleted successfully' });
});

module.exports = router;
