const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    newsname: String,
    artistname: [{
        firstname: String,
        lastname: String,
    }],
    namepath: Array,
    description: String,
    eventname: String,
    location: String,
    date: String,
    website: String
})

const News = mongoose.model('News', newsSchema);

module.exports = News