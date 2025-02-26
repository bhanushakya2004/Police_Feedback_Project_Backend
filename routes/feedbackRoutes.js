const express = require('express');
const Feedback = require('../models/Feedback'); // ✅ Import Feedback model

const router = express.Router();

// Fetch all feedbacks
router.get('/', async (req, res) => {  // ✅ Ensure '/' route exists
    try {
        const feedbacks = await Feedback.find();
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Post new feedback
router.post('/', async (req, res) => {
    try {
        const newFeedback = new Feedback(req.body);
        await newFeedback.save();
        res.status(201).json(newFeedback);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
