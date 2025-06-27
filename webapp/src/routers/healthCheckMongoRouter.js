const express = require('express')
const HealthCheckRepository = require('./healthcheckMongoRep')
const healthRouter = new express.Router()
const healthCheckRepo = new HealthCheckRepository()

healthRouter.get('/', async (req, res) => {
    try {
        const healthCheckData = await healthCheckRepo.getOrCreate()
        const isUp = !!healthCheckData

        if (isUp) {
            res.status(200).end()
        } else {
            res.status(502).end()
        }
    } catch (error) {
        res.status(502).end()
    }
})

module.exports = healthRouter
