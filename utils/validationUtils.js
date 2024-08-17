const Ajv = require('ajv');
const ajv = new Ajv();
const functionSchemas = require('../functionDefinitions');
const {getWeather, getTime} = require("../functions");
const {parseFuzzyJSON} = require("./jsonUtils");
const jsonic = require('jsonic'); // Assuming jsonic is already installed
const logger = require('../utils/logger');


/** @typedef {Object} FunctionCall
 * @property {string} name
 * @property {Object} parameters
 */

class ValidationError extends Error {
    constructor(functionName, args, errors) {
        super(`Validation failed for function ${functionName}`);
        this.functionName = functionName;
        this.args = args;
        this.errors = errors;
    }
}

const extractFunctionCalls = require('./extractFunctionCalls');

function validateFunctionCall(name, args) {
    logger.info({ name, args }, 'Validating function call');
    const schema = functionSchemas.find(s => s.name === name);
    if (!schema) throw new ValidationError(name, args, ['Unknown function']);
    const validate = ajv.compile(schema.parameters);
    const valid = validate(args);
    if (!valid) throw new ValidationError(name, args, validate.errors);
    return valid ? args : null;
}


// Function to execute a detected function call
/**
 *
 * @param {FunctionCall} functionCall
 * @returns {Promise<string>}
 */
async function executeFunction({ name, parameters }) {
    validateFunctionCall(name, parameters);

    logger.info({ name, parameters }, "LLM called a function")
    switch (name) {
        case 'getWeather':
            return await getWeather(parameters);
        case 'getTime':
            return await getTime(parameters);
        default:
            throw new Error('Unknown function');
    }
}

module.exports = { extractFunctionCalls, executeFunction, ValidationError };
