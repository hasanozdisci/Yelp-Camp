const mongoose = require("mongoose");
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers');
const Campground = require("../models/camground");

//connection and error handling
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("connection error:");
    console.log(err);
  });

//RANDOM NUMBER ARRAY FOR TITLE
const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}  


//RANDOM LOCATION AND TITLE
const seedDB = async () => {
  //DELETE EVERYTHING BEFORE TO CREATE RANDOM LOCATION AND TITLE  
  await Campground.deleteMany({});
  for(let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`
    })
    await camp.save();
  }  
};

seedDB().then(() => {
    mongoose.connection.close();
})