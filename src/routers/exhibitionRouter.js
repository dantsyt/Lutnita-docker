const express = require('express')
const path = require('node:path')
const exhibRouter = new express.Router()
const publicPath = path.join(__dirname, '../../public')

const Exhibition = require('../models/exhibitionMod')

exhibRouter.use(express.static(publicPath))

exhibRouter.get('/', (req, res) => {
    res.render('exhibitions', {
        title: 'Exhibitions'
    })
})

exhibRouter.get('/:exhibname', async (req, res) => {
    const exhibname = req.params.exhibname
    try {
        const exhibition = await Exhibition.findOne({ exhibname })
        if (!exhibition) {
            return res.status(404).render('404', {
                title: '404 exhibitions, not one found...'
            })
        }
        res.render('exhibitions_id')
    } catch (e) {
        console.log(e.message)
    }
})

module.exports = exhibRouter