const mongoose = require('mongoose')

const exhibSchema = new mongoose.Schema({
    exhibname: String,
    artistname: [{
        firstname: String,
        lastname: String,
    }],
    namepath: Array,
    date: String,
    description: String,
    imgpath: Array,
    captions: Array
})

const Exhibition = mongoose.model('Exhibition', exhibSchema);

module.exports = Exhibition