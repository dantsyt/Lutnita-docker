const express = require('express')
const path = require('node:path')
const artistsRouter = new express.Router()
const publicPath = path.join(__dirname, '../../public')

const Artist = require('../models/artistMod')

artistsRouter.use(express.static(publicPath))

artistsRouter.get('/', async (req, res) => {
    res.render('artists', {
        title: 'Artists'
    })
})

artistsRouter.get('/:fullname', async (req, res) => {
    const fullname = req.params.fullname
    try {
        const artist = await Artist.findOne({ fullname })
        if (!artist) {
            return res.status(404).render('404', {
                title: '404 artists, not one found'
            })
        }
        const firstName = artist.firstname.charAt(0).toUpperCase() + artist.firstname.slice(1)
        const lastName = artist.lastname.charAt(0).toUpperCase() + artist.lastname.slice(1)
        const fullName = `${firstName} ${lastName}`
        res.render('artists_id', {
            title: fullName
        })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

module.exports = artistsRouter