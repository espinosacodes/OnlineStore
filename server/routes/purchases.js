const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const verifyToken = require('../middleware/authMiddleware').verifyToken;
const purchasesFilePath = path.join(__dirname, '../models/purchases.json');

function readPurchases() {
    try {
        if (!fs.existsSync(purchasesFilePath)) {
            fs.writeFileSync(purchasesFilePath, JSON.stringify([]));
        }
        const data = fs.readFileSync(purchasesFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer purchases.json:", error);
        return [];
    }
}

function writePurchases(purchases) {
    try {
        fs.writeFileSync(purchasesFilePath, JSON.stringify(purchases, null, 2));
    } catch (error) {
        console.error("Error al escribir en purchases.json:", error);
    }
}

router.post('/add', (req, res) => {
    const { userId, productId, quantity, total } = req.body;
    const newPurchase = {
        userId,
        productId,
        quantity,
        total,
        date: new Date()
    };

    const purchases = readPurchases();
    purchases.push(newPurchase);
    writePurchases(purchases);

    res.status(201).json({ message: 'Compra realizada exitosamente', purchase: newPurchase });
});

router.get('/', (req, res) => {
    const purchases = readPurchases();
    res.json(purchases);
});

module.exports = router;