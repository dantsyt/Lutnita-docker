const express = require("express")
const HealthCheckRepository = require('./healthcheckMongoRep')
const router = express.Router({})
const healthCheckRepo = new HealthCheckRepository()

router.get('/', async (_req, res) => {
    const healthcheck = {
        status: 'UP',
        uptime: `${Math.floor(process.uptime())}s`,
        timestamp: new Date().toISOString(),
        components: {}
    }
    try {
        const dbCheck = await healthCheckRepo.getOrCreate()
        const dbStatus = dbCheck ? 'UP' : 'DOWN'
        healthcheck.components.mongo = { status: dbStatus }
        if (dbStatus !== 'UP') {
            healthcheck.status = 'DOWN'
            return res.status(502).send(healthcheck)
        }
        res.status(200).send(healthcheck)
    } catch (error) {
        healthcheck.status = 'DOWN'
        healthcheck.components.mongo = { status: 'DOWN', error: error.message }
        res.status(502).send(healthcheck)
    }
})

module.exports = router
