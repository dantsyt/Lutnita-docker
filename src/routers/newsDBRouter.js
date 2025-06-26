const express = require('express');
const newsDBRouter = new express.Router();

const News = require('../models/newsMod');

newsDBRouter.use(express.json());

newsDBRouter.get('/getNews', async (req, res) => {
    try {
        const news = await News.find({});
        res.send(news);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

newsDBRouter.post('/postNews', async (req, res) => {
    const news = new News(req.body);
    try {
        await news.save();
        res.status(201).send(news);
    } catch (e) {
        res.status(400).send(e.message);
    }
});


newsDBRouter.post('/editNews', async (req, res) => {
    try {
        await News.updateOne({ _id: "6511538934350da1036b8fee" }, {
            exhibname: "flaviucacoveanu"
        })
        res.status(201).send("Yeah bby")
    } catch (e) {
        res.status(400).send(e.message)
    }
})

module.exports = newsDBRouter