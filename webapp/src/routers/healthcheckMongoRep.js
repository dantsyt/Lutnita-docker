const HealthCheckModel = require('../models/healthCheckMod')
const logger = require('../logger')


class HealthCheckRepository {
    async getOrCreate() {
        const timeoutMs = 3000

        const timeout = new Promise((_, reject) =>
            setTimeout(() => {
                logger.error(`[HealthCheckRepository] getOrCreate: query timed out after ${timeoutMs}ms`)
                reject(new Error('DB query timed out'))
            }, timeoutMs)
        )

        const query = HealthCheckModel.findOneAndUpdate(
            { event: 'check' },
            { $setOnInsert: { event: 'check' } },
            {
                new: true,
                upsert: true,
                maxTimeMS: timeoutMs,
            }
        ).exec()

        try {
            const result = await Promise.race([query, timeout])
            logger.info('[HealthCheckRepository] getOrCreate: health check document found/created')
            return result
        } catch (err) {
            logger.error(`[HealthCheckRepository] getOrCreate: failed - ${err.message}`)
            throw err
        }
    }
}

module.exports = HealthCheckRepository
