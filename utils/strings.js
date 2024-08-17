const functionSchemas = require("../functionDefinitions");
const schemaHeader = (def) => { return `Use the function ${def.name} to: ${def.description}\n${JSON.stringify(def, null, 2)}`; }
module.exports = {
    boilerplate: {
        header: () => `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
        
When you receive a tool call response, use the output to format an answer to the original user question.

Environment: ipython
Cutting Knowledge Date: December 2023
Today Date: ${new Date().toLocaleString()}

You have access to the following functions:

${functionSchemas.map((def) => schemaHeader(def)).join('\n\n')}

`,
        footer: `<|start_header_id|>assistant<|end_header_id|>\n\n`,
        eot: '<|eot_id|>\n',
        functionHeader: () => `<|start_header_id|>ipython<|end_header_id|>\n\n`,
    },
    requestHeaders: () => { return {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
    }; },
};