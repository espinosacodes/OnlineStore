// routes/products.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { verifyAdmin } = require('../middleware/authMiddleware');

const productsFilePath = path.join(__dirname, '../models/products.json');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Read products
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

// Write products
function writeProducts(products) {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error writing to products.json:', error);
  }
}

// Add product route
router.post('/add', verifyAdmin, upload.single('image'), (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price,
    image: req.file ? req.file.filename : null,
  };
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json({ message: 'Product added', product: newProduct });
});

// Get products route
router.get('/', (req, res) => {
  const products = readProducts();
  res.json(products);
});

module.exports = router;