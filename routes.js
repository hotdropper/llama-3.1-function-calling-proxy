const express = require('express');
const axios = require('axios');
const { handleCompletionRequest } = require('./handlers/completionHandler');

const router = express.Router();

const COMPLETION_ENDPOINT = process.env.COMPLETION_ENDPOINT || '/v1/completions';

// Generic pass-through handler for all OpenAI endpoints except /completions
router.use(async (req, res, next) => {
    if (req.path === COMPLETION_ENDPOINT) {
        return next(); // Skip to the completion-specific handler
    }

    try {
        const openAiResponse = await axios({
            method: req.method,
            url: `${process.env.OPENAI_API_BASE_URL}${req.path}`,
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            data: req.body
        });

        res.status(openAiResponse.status).json(openAiResponse.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// Custom handler for /v1/completions
router.post(COMPLETION_ENDPOINT, handleCompletionRequest);

module.exports = router;
