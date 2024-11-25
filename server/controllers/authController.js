const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';

// Función para leer JSON
const readJSON = (fileName) => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'models', fileName)));
};

// Función para escribir JSON
const writeJSON = (fileName, data) => {
    fs.writeFileSync(path.join(__dirname, '..', 'models', fileName), JSON.stringify(data, null, 2));
};

// Función para registrar usuario
exports.register = (req, res) => {
    const { username, password, role } = req.body;
    const users = readJSON('users.json');
    users.push({ username, password, role });
    writeJSON('users.json', users);
    res.json({ message: 'Usuario registrado' });
};

// Función para el login
exports.login = (req, res) => {
    const { username, password } = req.body;
    const users = readJSON('users.json');
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY);
    res.json({ message: 'Login exitoso', token, role: user.role });
};
