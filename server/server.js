const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// In a real application, this would be in a database
const users = {
    // The password here is hashed, so it's safe to store
    admin: {
        passwordHash: bcrypt.hashSync('admin123', 10)
    }
};

const JWT_SECRET = process.env.JWT_SECRET || 'chikkha1999'; // Use environment variable in production

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Check if user exists
    const user = users[username];
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
        { username },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token });
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Protected route example
app.get('/api/verify', verifyToken, (req, res) => {
    res.json({ isValid: true });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
