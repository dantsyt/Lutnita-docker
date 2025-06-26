const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    fullname: String,
    namepath: String,
    imgpath: Array,
    imgpathmob: Array,
    captions: Array
})

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist