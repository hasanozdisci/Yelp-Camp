const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

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
};

//RANDOM LOCATION AND TITLE
const seedDB = async () => {
  //DELETE EVERYTHING BEFORE TO CREATE RANDOM LOCATION AND TITLE
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "63186ae03581ed609a87cb2b",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque sed, impedit officia praesentium temporibus consequatur repudiandae, libero nihil, porro laborum fugit ipsa accusamus labore. Reiciendis optio labore ipsa nesciunt minima!",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dzybcr4gg/image/upload/v1662895558/YelpCamp/uokw2pwe3zddwxvywlvh.jpg",
          filename: "YelpCamp/uokw2pwe3zddwxvywlvh",
        },
        {
          url: "https://res.cloudinary.com/dzybcr4gg/image/upload/v1662895558/YelpCamp/i6ak7hsshzihljzz0zq1.jpg",
          filename: "YelpCamp/i6ak7hsshzihljzz0zq1",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
