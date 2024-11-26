const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Configura el archivo JSON donde se almacenarán los usuarios
const usersFilePath = path.join(__dirname, '../models/users.json');
const SECRET_KEY = 'your_secure_jwt_secret_key';

// Función para leer los usuarios
function readUsers() {
    try {
        if (!fs.existsSync(usersFilePath)) {
            fs.writeFileSync(usersFilePath, JSON.stringify([]));
        }
        const data = fs.readFileSync(usersFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer el archivo users.json:", error);
        return [];
    }
}

// Función para escribir usuarios
function writeUsers(users) {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error("Error al escribir en el archivo users.json:", error);
    }
}

// Ruta de registro para agregar nuevos usuarios
router.post('/register', async (req, res) => {
    const { username, password, role = "client" } = req.body;  // Asigna "client" por defecto al rol
    const users = readUsers();

    // Verifica si ya existe un administrador (si el rol es "admin")
    if (role === 'admin') {
        const adminExists = users.some(user => user.role === 'admin');
        if (adminExists) {
            return res.status(400).json({ message: 'Ya existe un administrador.' });
        }
    }

    // Verifica si el usuario ya existe
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Cifra la contraseña y guarda el nuevo usuario con su rol
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword, role };  // Asegura que el rol se incluye aquí
    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(403).json({ message: 'Credenciales inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(403).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Inicio de sesión exitoso', token });
});

module.exports = router;
