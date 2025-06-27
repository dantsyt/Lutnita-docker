const mongoose = require('mongoose')

const HealthCheckSchema = new mongoose.Schema(
    {
        event: String,
    },
    {
        collection: 'HealthCheck',
        minimize: false,
    }
)

module.exports = mongoose.model('HealthCheck', HealthCheckSchema)
