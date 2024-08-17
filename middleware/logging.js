const logger = require('../utils/logger');

function requestLogger(req, res, next) {
    req.startTime = Date.now();

    logger.info({
        path: req.path,
        method: req.method,
        body: req.body
    }, 'Request received (client -> proxy)');

    res.on('finish', () => {
        const duration = Date.now() - req.startTime;
        logger.info({
            path: req.path,
            method: req.method,
            status: res.statusCode,
            duration
        }, 'Request processed (proxy -> client)');
    });

    next();
}

module.exports = requestLogger;
