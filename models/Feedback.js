const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
    aadharNumber: String,
    address: String,
    policeStationNumber: String,
    feedbackType: String,
    sentiment: String,
    feedback: String,
    translatedFeedback: String, // New field to store English-translated feedback
    aiSentiment: String,  // AI-generated sentiment (e.g., "positive", "negative", "neutral")
    aiAnalysis: String,   // AI's detailed sentiment analysis
    language: String,     // Original language of the feedback
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
