const express = require('express')
const artistsDBRouter = new express.Router()

const Artist = require('../models/artistMod')

artistsDBRouter.use(express.json())

artistsDBRouter.get('/getArtists', async (req, res) => {
    try {
        const artist = await Artist.find({})
        res.send(artist)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

artistsDBRouter.get('/getOneArtist/:fullname', async (req, res) => {
    const fullname = req.params.fullname
    try {
        const artist = await Artist.findOne({ fullname })
        if (!artist) { return res.status(404).send('404 artists, not one found') }
        res.send(artist)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

artistsDBRouter.post('/postArtist', async (req, res) => {
    const artist = Artist(req.body)
    try {
        await artist.save()
        res.status(201).send(artist)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

artistsDBRouter.post('/editArtist', async (req, res) => {
    try {
        await Artist.updateOne({ fullname: "flaviucacoveanu" }, {
            captions: ["Exhibition view\nOur Other Us, Art Encounters Biennale, Timișoara, Romania, 2021",
                "Exhibition view\nOur Other Us, Art Encounters Biennale, Timișoara, Romania, 2021",
                "Exhibition view\nNotifications, Art Au Centre Liege 11, Belgium, 2023",
                "Exhibition view\nLazerpresent, Parliament, Paris, France, 2022",
                "Red Planet\nvideo still, 2019",
                "Exhibition view\nLazerpresent, Parliament, Paris, France, 2022",
                "Untitled (60% Water)\nC-print photograph, 2019\n55 x 85 cm",
                "Fly On Moon\nUV print on plexi-glass, 2019\n150 x 80 cm",
                "Exhibition view\nLazerpresent, Parliament, Paris, France, 2022",
                "Untitled (Lazerpresent)\n3 channel video installation with TV screen and 2 projectors, selection of 25 looping videos, 2022\nvariable dimensions",
                "Exhibition view\nLazerpresent, Parliament, Paris, France, 2022",
                "News\nsilk-screen on paper bag left on the street, 2022\n40 x 30 x 5 cm",
                "I Gazed At The Stars But They All Fell Down\nneons, metal frame, 2017\n320 x 20 x 5 cm",
                "Exhibition view\nTime flies I don’t, White Cuib, Romania, 2022",
                "Exhibition view\nTime flies I don’t, White Cuib, Romania, 2022",
                "Untitled (Egg)\nphotograph, tape, 2022\n15 x 20 cm",
                "Untitled (ParaSinus)\none dollar bill origami, medicine box, magnets, 2022",
                "Bipolar S\nneon sign, 2019\n35 x 18 x 5 cm",
                "Chess For Snails\nhorizontal UHD video file, no sound, loop, 31:20 minutes, 2016-2022",
                "Chess For Snails\nvideo still, 2016-2022"
            ]
        })
        res.status(201).send("Yeah bby")
    } catch (e) {
        res.status(400).send(e.message)
    }
})

module.exports = artistsDBRouter

