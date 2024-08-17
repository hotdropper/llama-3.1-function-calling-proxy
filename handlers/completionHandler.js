const { executeFunction, ValidationError } = require('../utils/validationUtils');
const { extractFunctionCalls } = require('../utils/extractFunctionCalls');
const { makeOpenAiRequest } = require('../utils/openAiUtils');
const logger = require('../utils/logger');
const strings = require('../utils/strings');

async function handleCompletionRequest(req, res) {
    try {
        // Log the incoming request
        logger.info({ body: req.body }, 'Received completion request (client -> proxy)');

        const { prompt, ...rest } = req.body;

        // Construct the prompt
        const boilerplateHeader = strings.boilerplate.header();
        const eot = strings.boilerplate.eot;
        const boilerplateFooter = strings.boilerplate.footer;
        const modifiedPrompt = `${boilerplateHeader}${prompt}${eot}${boilerplateFooter}`;

        // Log the modified prompt
        logger.info({ modifiedPrompt }, 'Constructed modified prompt');

        // Make the first request to OpenAI
        logger.info('Sending initial request to OpenAI');
        let openAiResponse = await makeOpenAiRequest(req, modifiedPrompt, rest);
        logger.info({ status: openAiResponse.status, headers: openAiResponse.headers }, 'Received response from OpenAI');

        let responseContent = openAiResponse.data.content;

        // Log the response content
        logger.info({ responseContent }, 'Initial response content from OpenAI');

        // Extract and handle function calls if present
        const functionCalls = extractFunctionCalls(responseContent);
        if (functionCalls.length === 0) {
            logger.info('No function calls detected in the response');
            return res.status(openAiResponse.status).json(openAiResponse.data);
        }

        const lastJsonChar = responseContent.lastIndexOf('}');
        if (lastJsonChar !== -1) {
            responseContent = responseContent.slice(0, lastJsonChar + 1);
        }

        // Log detected function calls
        logger.info({ functionCalls }, 'Detected function calls from response');

        // Execute each function and log results
        const results = await Promise.all(functionCalls.map(async call => {
            try {
                const result = await executeFunction(call);
                logger.info({ call, result }, 'Function executed successfully');
                return result;
            } catch (e) {
                if (e instanceof ValidationError) {
                    logger.error({ error: e.message, call: { name: e.functionName, parameters: e.parameters }, errors: e.errors }, 'Validation error in function call');
                    return { error: e.message, call: { name: e.functionName, parameters: e.parameters }, validationErrors: e.errors };
                } else {
                    logger.error({ error: e.message, call: { name: call.name, parameters: call.parameters } }, 'Error executing function');
                    return { error: e.message, call: { name: call.name, parameters: call.parameters } };
                }
            }
        }));

        const formattedResults = results.map(result => strings.boilerplate.functionHeader() + JSON.stringify(result) + strings.boilerplate.eot);

        // Ensure the response content ends with EOT
        if (!responseContent.endsWith(strings.boilerplate.eot.trim())) {
            logger.info('Modifying response to include proper end-stop');
            responseContent += strings.boilerplate.eot;
        }

        // Trim unnecessary content and construct the final prompt
        const cleanResponseContent = responseContent.replace(/(?:\n\s*|\bipython\b|system|assistant)/g, '').trim();
        const finalPrompt = `${modifiedPrompt}${cleanResponseContent}\n\n${formattedResults.join('\n')}\n${strings.boilerplate.footer}`;

        logger.info({ finalPrompt }, 'Constructed final prompt for second request');

        // Make the second request to OpenAI with the final prompt
        logger.info('Sending final request to OpenAI');
        openAiResponse = await makeOpenAiRequest(req, finalPrompt, rest);
        logger.info({ status: openAiResponse.status, headers: openAiResponse.headers, data: openAiResponse.data }, 'Received final response from OpenAI');

        // Send the final response to the client
        res.status(openAiResponse.status).json(openAiResponse.data);
    } catch (error) {
        logger.error({ error: error.message, stack: error.stack }, 'Error handling completion request');
        res.status(500).json({ error: error.message });
    }
}

module.exports = { handleCompletionRequest };
