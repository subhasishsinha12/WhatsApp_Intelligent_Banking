const winston = require('winston');
const morgan = require('morgan');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

const morganMiddleware = morgan('combined', {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
});

module.exports = { logger, morganMiddleware };
