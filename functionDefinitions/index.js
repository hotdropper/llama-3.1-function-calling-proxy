const path = require("path");
const functionSchemaPaths = require('./functionDefinitions.json').functions;
module.exports = functionSchemaPaths.map(schemaPath => require(path.resolve(schemaPath)));