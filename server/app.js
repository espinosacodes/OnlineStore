const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

const purchasesRouter = require('./routes/purchases');
app.use('/api/purchases', purchasesRouter);

const salesRouter = require('./routes/sales');
app.use('/api/sales', salesRouter);

// Serve static files from the "client" directory
app.use(express.static(path.join(__dirname, '../client')));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'customer.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});