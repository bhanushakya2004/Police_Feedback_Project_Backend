// const { OpenAI } = require('openai');
// const Feedback = require('../models/Feedback');
// require('dotenv').config();

// // Initialize OpenAI client for OpenRouter
// const client = new OpenAI({
//     baseURL: "https://openrouter.ai/api/v1",
//     apiKey: process.env.OPENROUTER_API_KEY,
// });

// /**
//  * Function to analyze sentiment using OpenRouter Gemini model
//  */
// const analyzeSentimentWithOpenRouter = async (feedbackText) => {
//     try {
//         const completion = await client.chat.completions.create({
//             model: "google/gemini-2.0-pro-exp-02-05:free",
//             extra_headers: {
//                 "HTTP-Referer": process.env.SITE_URL || "", // Optional site URL for rankings
//                 "X-Title": process.env.SITE_NAME || "", // Optional site name for rankings
//             },
//             messages: [
//                 {
//                     role: "user",
//                     content: `Analyze sentiment of this feedback in one line: "${feedbackText}"`
//                 }
//             ]
//         });

//         console.log("AI Response:", JSON.stringify(completion, null, 2)); // Debugging log

//         // Safe access to API response
//         const aiAnalysis = completion?.choices?.[0]?.message?.content || "Could not analyze sentiment";

//         return aiAnalysis;
//     } catch (error) {
//         console.error('AI Sentiment Analysis Error:', error?.response?.data || error.message);
//         return "Could not analyze sentiment";
//     }
// };

// /**
//  * Function to analyze sentiment asynchronously and update the feedback record
//  */
// const analyzeAndUpdateSentiment = async (feedbackId, feedbackText) => {
//     try {
//         const aiAnalysis = await analyzeSentimentWithOpenRouter(feedbackText);

//         const aiSentiment = aiAnalysis.toLowerCase().includes('positive') ? 'positive' :
//                             aiAnalysis.toLowerCase().includes('negative') ? 'negative' : 'neutral';

//         // Update feedback with AI analysis
//         await Feedback.findByIdAndUpdate(feedbackId, {
//             aiSentiment,
//             aiAnalysis
//         });

//         console.log(`AI analysis completed for feedback ID: ${feedbackId}`);
//     } catch (error) {
//         console.error('Error updating feedback AI analysis:', error);
//         await Feedback.findByIdAndUpdate(feedbackId, {
//             aiSentiment: 'error',
//             aiAnalysis: 'Could not analyze sentiment'
//         });
//     }
// };

// /**
//  * Submit Feedback API - Stores feedback and triggers AI analysis in the background
//  */
// const submitFeedback = async (req, res) => {
//     try {
//         const { name, phoneNumber, aadharNumber, address, policeStationNumber, feedbackType, sentiment, feedback, language } = req.body;

//         // Save feedback first without waiting for AI analysis
//         const newFeedback = new Feedback({
//             name,
//             phoneNumber,
//             aadharNumber,
//             address,
//             policeStationNumber,
//             feedbackType,
//             sentiment,
//             feedback,
//             aiSentiment: 'pending',  // AI sentiment will be updated later
//             aiAnalysis: 'Analysis in progress...',
//             language
//         });

//         const savedFeedback = await newFeedback.save();

//         // Process AI Sentiment in the background
//         process.nextTick(() => analyzeAndUpdateSentiment(savedFeedback._id, feedback));

//         res.status(201).json({ message: "Feedback submitted successfully", data: savedFeedback });
//     } catch (error) {
//         console.error('Error submitting feedback:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// /**
//  * Get All Feedbacks API - Fetch all feedbacks for admin dashboard
//  */
// const getAllFeedbacks = async (req, res) => {
//     try {
//         const feedbacks = await Feedback.find().sort({ createdAt: -1 });
//         res.json(feedbacks);
//     } catch (error) {
//         console.error('Error fetching feedbacks:', error);
//         res.status(500).json({ error: 'Error fetching feedbacks' });
//     }
// };

// module.exports = { submitFeedback, getAllFeedbacks };
// new code






// const { LanguageServiceClient } = require('@google-cloud/language');
// const Feedback = require('../models/Feedback');
// require('dotenv').config();

// // Initialize Google Cloud NLP Client
// const client = new LanguageServiceClient();

// /**
//  * Function to analyze sentiment using Google Cloud NLP
//  */
// const analyzeSentimentWithGCP = async (feedbackText) => {
//     try {
//         const document = {
//             content: feedbackText,
//             type: 'PLAIN_TEXT',
//         };

//         const [result] = await client.analyzeSentiment({ document });
//         const sentimentScore = result.documentSentiment.score;

//         console.log("Sentiment Score:", sentimentScore); // Debugging log

//         let aiSentiment = 'neutral';
//         if (sentimentScore > 0.25) aiSentiment = 'positive';
//         else if (sentimentScore < -0.25) aiSentiment = 'negative';

//         return { aiSentiment, aiAnalysis: `Sentiment score: ${sentimentScore}` };
//     } catch (error) {
//         console.error('GCP NLP Error:', error.message);
//         return { aiSentiment: 'error', aiAnalysis: 'Could not analyze sentiment' };
//     }
// };

// /**
//  * Function to analyze sentiment asynchronously and update the feedback record
//  */
// const analyzeAndUpdateSentiment = async (feedbackId, feedbackText) => {
//     try {
//         const { aiSentiment, aiAnalysis } = await analyzeSentimentWithGCP(feedbackText);

//         // Update feedback with AI analysis
//         await Feedback.findByIdAndUpdate(feedbackId, {
//             aiSentiment,
//             aiAnalysis
//         });

//         console.log(`AI analysis completed for feedback ID: ${feedbackId}`);
//     } catch (error) {
//         console.error('Error updating feedback AI analysis:', error);
//         await Feedback.findByIdAndUpdate(feedbackId, {
//             aiSentiment: 'error',
//             aiAnalysis: 'Could not analyze sentiment'
//         });
//     }
// };

// /**
//  * Submit Feedback API - Stores feedback and triggers AI analysis in the background
//  */
// const submitFeedback = async (req, res) => {
//     try {
//         const { name, phoneNumber, aadharNumber, address, policeStationNumber, feedbackType, sentiment, feedback, language } = req.body;

//         // Save feedback first without waiting for AI analysis
//         const newFeedback = new Feedback({
//             name,
//             phoneNumber,
//             aadharNumber,
//             address,
//             policeStationNumber,
//             feedbackType,
//             sentiment,
//             feedback,
//             aiSentiment: 'pending',  // AI sentiment will be updated later
//             aiAnalysis: 'Analysis in progress...',
//             language
//         });

//         const savedFeedback = await newFeedback.save();

//         // Process AI Sentiment in the background
//         process.nextTick(() => analyzeAndUpdateSentiment(savedFeedback._id, feedback));

//         res.status(201).json({ message: "Feedback submitted successfully", data: savedFeedback });
//     } catch (error) {
//         console.error('Error submitting feedback:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// /**
//  * Get All Feedbacks API - Fetch all feedbacks for admin dashboard
//  */
// const getAllFeedbacks = async (req, res) => {
//     try {
//         const feedbacks = await Feedback.find().sort({ createdAt: -1 });
//         res.json(feedbacks);
//     } catch (error) {
//         console.error('Error fetching feedbacks:', error);
//         res.status(500).json({ error: 'Error fetching feedbacks' });
//     }
// };

// module.exports = { submitFeedback, getAllFeedbacks };

const { LanguageServiceClient } = require('@google-cloud/language');
const { Translate } = require('@google-cloud/translate').v2;
const Feedback = require('../models/Feedback');
require('dotenv').config();

// Initialize Google Cloud NLP Client
const nlpClient = new LanguageServiceClient();

// Initialize Google Cloud Translation Client
const translateClient = new Translate();

/**
 * Function to translate text to English using Google Cloud Translation API
 */
const translateTextToEnglish = async (text, sourceLang) => {
    try {
        if (sourceLang === 'en') return text; // Skip translation if already in English

        const [translation] = await translateClient.translate(text, 'en');
        console.log(`Translated Text: ${translation}`); // Debugging log

        return translation;
    } catch (error) {
        console.error('Translation Error:', error.message);
        return text; // Return original text if translation fails
    }
};

/**
 * Function to analyze sentiment using Google Cloud NLP
 */
const analyzeSentimentWithGCP = async (feedbackText) => {
    try {
        const document = {
            content: feedbackText,
            type: 'PLAIN_TEXT',
        };

        const [result] = await nlpClient.analyzeSentiment({ document });
        const sentimentScore = result.documentSentiment.score;

        console.log("Sentiment Score:", sentimentScore); // Debugging log

        let aiSentiment = 'neutral';
        if (sentimentScore > 0.25) aiSentiment = 'positive';
        else if (sentimentScore < -0.25) aiSentiment = 'negative';

        return { aiSentiment, aiAnalysis: `Sentiment score: ${sentimentScore}` };
    } catch (error) {
        console.error('GCP NLP Error:', error.message);
        return { aiSentiment: 'error', aiAnalysis: 'Could not analyze sentiment' };
    }
};

/**
 * Function to analyze sentiment asynchronously and update the feedback record
 */
const analyzeAndUpdateSentiment = async (feedbackId, feedbackText, language) => {
    try {
        const translatedText = await translateTextToEnglish(feedbackText, language);
        const { aiSentiment, aiAnalysis } = await analyzeSentimentWithGCP(translatedText);

        // Update feedback with AI analysis and store the translated feedback
        await Feedback.findByIdAndUpdate(feedbackId, {
            aiSentiment,
            aiAnalysis,
            translatedFeedback: translatedText, // Save translated feedback
        });

        console.log(`AI analysis completed for feedback ID: ${feedbackId}`);
    } catch (error) {
        console.error('Error updating feedback AI analysis:', error);
        await Feedback.findByIdAndUpdate(feedbackId, {
            aiSentiment: 'error',
            aiAnalysis: 'Could not analyze sentiment',
            translatedFeedback: null, // Set to null if translation fails
        });
    }
};

/**
 * Submit Feedback API - Stores feedback and triggers AI analysis in the background
 */
const submitFeedback = async (req, res) => {
    try {
        const { name, phoneNumber, aadharNumber, address, policeStationNumber, feedbackType, sentiment, feedback, language } = req.body;

        // Save feedback first without waiting for AI analysis
        const newFeedback = new Feedback({
            name,
            phoneNumber,
            aadharNumber,
            address,
            policeStationNumber,
            feedbackType,
            sentiment,
            feedback,
            aiSentiment: 'pending',  // AI sentiment will be updated later
            aiAnalysis: 'Analysis in progress...',
            language,
            translatedFeedback: null, // Placeholder for translated feedback
        });

        const savedFeedback = await newFeedback.save();

        // Process AI Sentiment in the background
        process.nextTick(() => analyzeAndUpdateSentiment(savedFeedback._id, feedback, language));

        res.status(201).json({ message: "Feedback submitted successfully", data: savedFeedback });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Get All Feedbacks API - Fetch all feedbacks for admin dashboard
 */
const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ error: 'Error fetching feedbacks' });
    }
};

module.exports = { submitFeedback, getAllFeedbacks };
