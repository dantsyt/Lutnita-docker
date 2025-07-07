const morgan = require('morgan')
const logger = require('./logger')
const requestIp = require('request-ip')
const os = require('os')

morgan.token('header-ip', function (req, res) {
    const ffHeaderValue = req.headers['x-real-ip']
    return ffHeaderValue || req.socket.remoteAddress
})

morgan.token('trueIp', function (req) {
    return requestIp.getClientIp(req)
})

morgan.token('hostname', () => { return os.hostname() })

const morganFormat = `{
    "headerIp": ":header-ip",
    "originalsourceip": ":trueIp",
    "httpVersion": "HTTP/:http-version",
    "referrer": ":referrer",
    "userAgent": ":user-agent",
    "method": ":method",
    "requestPath": ":url",
    "status": ":status",
    "responseTime": ":response-time",
    "hostname": ":hostname"
}`

function messageHandler(message) {
    logger.info('', JSON.parse(message.trim()))
}

const morganMiddleware = morgan(
    morganFormat,
    {
        stream: {
            write: messageHandler
        }
    }
)

const ipMiddleware = (req, res, next) => {
    req.originalsourceip = requestIp.getClientIp(req)
    next()
}

module.exports = { morganMiddleware, ipMiddleware }
