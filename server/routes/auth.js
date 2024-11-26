const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';
const usersFilePath = path.join(__dirname, '../models/users.json');

// Utility functions to read/write users
function readUsers() {
  try {
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users.json:', error);
    return [];
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing to users.json:', error);
  }
}

// Registration route
router.post('/register', async (req, res) => {
  const { username, password, role = 'client' } = req.body;
  const users = readUsers();

  // Check if an admin already exists
  if (role === 'admin') {
    const adminExists = users.some((user) => user.role === 'admin');
    if (adminExists) {
      return res.status(400).json({ message: 'An admin already exists.' });
    }
  }

  // Check if the user already exists
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password and save the new user with their role
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashedPassword, role };
  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: 'User registered successfully' });
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(403).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(403).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

  // Enviar token y rol en la respuesta
  res.json({
    message: 'Login successful',
    token,
    role: user.role,
  });
});

// Protected route
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Access granted to protected route', user: req.user });
});

// Admin route
router.get('/admin', verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: 'Access granted to admin route' });
});

module.exports = router;
