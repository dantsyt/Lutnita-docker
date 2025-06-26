const mongoose = require('mongoose')
const logger = require('../logger')

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB')
    })
    .catch((err) => {
        logger.error('MongoDB connection error:', err)
    })
