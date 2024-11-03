// sales.js
const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const salesController = require('../controllers/salesController');

const router = express.Router();

// Ruta para registrar una venta
router.post('/purchase', verifyToken, salesController.registerSale);

// Ruta para obtener todas las ventas de un usuario
router.get('/history', verifyToken, salesController.getSalesHistory);

module.exports = router;
