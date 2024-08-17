const logger = require("./logger");
const jsonic = require("jsonic");

function extractFunctionCalls(responseContent) {
    // Log the initial response content
    logger.info({ responseContent }, 'Initial response content for function extraction');

    // Extract the JSON part by looking for the first '{' and the last '}'
    const jsonStart = responseContent.indexOf('{');
    const jsonEnd = responseContent.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
        logger.warn('No valid JSON-like structure found in the response content');
        return []; // No valid JSON found
    }

    let jsonString = responseContent.slice(jsonStart, jsonEnd + 1).trim();

    // Handle potential special characters or token separators
    jsonString = jsonString.replace(/\\n|<\|/g, '').trim();

    logger.info({ jsonString }, 'Extracted JSON-like string from response content');

    // Parse the extracted JSON using jsonic
    try {
        const parsedContent = jsonic(jsonString);
        logger.info({ parsedContent }, 'Parsed content from jsonic');

        // Ensure the parsed content is in the expected format
        if (parsedContent.name && parsedContent.parameters) {
            return [parsedContent];
        } else {
            logger.warn('Parsed content does not match expected function call structure');
            return [];
        }
    } catch (e) {
        // Log the error and return an empty array if parsing fails
        logger.error({ jsonString, error: e.message }, 'Failed to parse extracted JSON using jsonic');
        return [];
    }
}

module.exports = { extractFunctionCalls };
