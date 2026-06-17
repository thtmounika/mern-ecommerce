require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const verifyJWT = require('./middleware/verifyJWT');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.DATABASE_URI)
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
    });

// Home Route
app.get('/', (req, res) => {
    res.send('E-Commerce Backend Running...');
});

// Public Routes
app.use('/auth', require('./routes/authRoutes'));

// View Users (Temporary Debug Route)
app.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Protect everything below with JWT
app.use(verifyJWT);

// Product Routes
app.use('/products', require('./routes/productRoutes'));

const PORT = process.env.PORT || 5000;

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});