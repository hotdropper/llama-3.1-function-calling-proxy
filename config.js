require("@dotenvx/dotenvx").config();

module.exports = {
    OPENAI_API_BASE_URL: process.env.OPENAI_API_BASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    PORT: process.env.PORT || 3000,
    HOST: process.env.HOST || 'localhost'
};
