const express = require('express');
const { addProduct, getProducts } = require('../controllers/productController');
const { verifyAdmin, verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Define tus rutas para productos aquí
router.post('/add', verifyToken, verifyAdmin, addProduct);
router.get('/', getProducts);

module.exports = router;
