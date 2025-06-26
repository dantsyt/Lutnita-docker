const express = require('express')
const path = require('node:path')
const newsRouter = new express.Router()
const publicPath = path.join(__dirname, '../../public')

const News = require('../models/newsMod')

newsRouter.use(express.static(publicPath))

newsRouter.get('/', (req, res) => {
    res.render('news', {
        title: 'News'
    })
})

module.exports = newsRouter