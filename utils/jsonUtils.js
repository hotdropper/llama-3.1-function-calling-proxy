const jsonic = require('jsonic');

function parseFuzzyJSON(responseContent) {
    try {
        return jsonic(responseContent);
    } catch (e) {
        return null;
    }
}

module.exports = { parseFuzzyJSON };
