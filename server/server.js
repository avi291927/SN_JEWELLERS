require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const enquiryRoutes = require('./routes/enquiries');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiryRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'SN Jewellers API is running' });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'MulterError') {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    res.status(500).json({ message: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SN Jewellers API running on port ${PORT}`);
});
