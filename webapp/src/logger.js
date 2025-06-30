const winston = require('winston')
const moment = require('moment')

const removeTimestamp = winston.format((info, opts) => {
    if (info.timestamp) {
        delete info.timestamp;
        return info;
    }
})

const customFormat = winston.format.combine(
    winston.format.timestamp({
        format: () => moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'), alias: '@timestamp'
    }),
    removeTimestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, originalsourceip, ...meta }) => {
        return JSON.stringify({
            '@timestamp': timestamp,
            level,
            message,
            originalsourceip,
            ...meta
        })
    })
)

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: customFormat,
    defaultMeta: {
        environment: process.env.NODE_ENV,
        nodeVersion: process.version
    },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                //               winston.format.colorize(),
                winston.format.json()
            )
        }),
        new winston.transports.File({
            format: winston.format.combine(
                winston.format.json()
            ),
            filename: 'combined.log'
        }),
        new winston.transports.File({
            format: winston.format.combine(
                winston.format.json()
            ),
            filename: 'error.log',
            level: 'error'
        })
    ]
})

module.exports = logger