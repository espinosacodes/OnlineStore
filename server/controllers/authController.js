const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const SECRET_KEY = 'your_secret_key';

// Lee y guarda los datos en JSON
const readJSON = (file) => JSON.parse(fs.readFileSync(file));
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data));

// Registro
exports.register = (req, res) => {
    const { username, password, role } = req.body;
    const users = readJSON('./models/users.json');
    if (users.find(user => user.username === username)) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ username, password: hashedPassword, role });
    writeJSON('./models/users.json', users);

    res.json({ message: 'User registered' });
};

// Inicio de sesión
exports.login = (req, res) => {
    const { username, password } = req.body;
    const users = readJSON('./models/users.json');
    const user = users.find(u => u.username === username);
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
};
