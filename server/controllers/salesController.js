// salesController.js
const fs = require('fs');

// Leer y escribir JSON
const readJSON = (file) => JSON.parse(fs.readFileSync(file));
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data));

// Registrar una nueva venta
exports.registerSale = (req, res) => {
    const sales = readJSON('./models/sales.json');
    const newSale = {
        userId: req.user.id,
        products: req.body.products,
        total: req.body.total,
        date: new Date(),
    };

    sales.push(newSale);
    writeJSON('./models/sales.json', sales);

    res.status(201).json({ message: 'Sale registered successfully', sale: newSale });
};

// Obtener el historial de ventas de un usuario
exports.getSalesHistory = (req, res) => {
    const sales = readJSON('./models/sales.json');
    const userSales = sales.filter(sale => sale.userId === req.user.id);
    res.json(userSales);
};


exports.createInvoice = (req, res) => {
    const { items, total } = req.body;
    const sales = readJSON('./models/sales.json');
    
    const invoice = { items, total, date: new Date() };
    sales.push(invoice);
    writeJSON('./models/sales.json', sales);

    res.json({ message: 'Invoice generated', invoice });
};