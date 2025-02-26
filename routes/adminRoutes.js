const express = require('express');
const Admin = require('../models/Admin');

const router = express.Router();

// Admin Login Route (Simple Check Without JWT)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin || admin.password !== password) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        res.json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Route to create an admin (Only for initial setup, remove after use)
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

        const newAdmin = new Admin({ username, password });
        await newAdmin.save();

        res.json({ message: "Admin created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
