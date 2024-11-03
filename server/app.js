const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración para servir archivos estáticos desde la carpeta 'client'
app.use('/cliente', express.static('client'));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);

// Redirigir la ruta raíz al cliente
app.get('/', (req, res) => {
    res.redirect('/cliente');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
