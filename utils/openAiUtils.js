const strings = require('./strings');
const axios = require('axios');
const logger = require('./logger');

async function makeOpenAiRequest(req, prompt, rest) {
    const baseUrl = process.env.OPENAI_API_BASE_URL.replace(/\/+$/, ''); // Remove trailing slashes
    const path = req.path.replace(/^\/+/, ''); // Remove leading slashes
    const url = `${baseUrl}/${path}`;

    logger.info({ url, prompt }, 'Making request to OpenAI API');

    return await axios.post(url, {
        prompt,
        ...rest
    }, {
        headers: strings.requestHeaders(),
    });
}
module.exports = { makeOpenAiRequest };
