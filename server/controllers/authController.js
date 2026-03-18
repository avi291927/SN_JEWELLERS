const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

exports.signup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password, phone } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }
        const user = await User.create({ name, email, password, phone });
        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = generateToken(user._id);
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        const user = await User.findOne({ email, role: 'admin' }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }
        const token = generateToken(user._id);
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
