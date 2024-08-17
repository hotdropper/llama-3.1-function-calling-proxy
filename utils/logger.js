const pino = require('pino');

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard', // Format timestamp
            ignore: 'pid,hostname' // Ignore unnecessary fields
        }
    },
    level: process.env.LOG_LEVEL || 'info' // Default log level
});

module.exports = logger;
