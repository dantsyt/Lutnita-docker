const HealthCheckModel = require('../models/healthCheckMod')

class HealthCheckRepository {
    async getOrCreate() {
        const data = await HealthCheckModel.findOneAndUpdate(
            { event: 'check' },
            { event: 'check' },
            {
                new: true,
                upsert: true,
            }
        )
        return data
    }
}

module.exports = HealthCheckRepository
