const mongoose = require('mongoose')
const Schema = mongoose.Schema; //shortcut

const CampGroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', CampGroundSchema)