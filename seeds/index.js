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
      geometry: {
        type: "Point",
        coordinates: [-113.1331, 47.0202],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dzybcr4gg/image/upload/v1663076429/YelpCamp/ee1ifispf8wvjsdspaxv.jpg",
          filename: "YelpCamp/uokw2pwe3zddwxvywlvh",
        },
        {
          url: "https://res.cloudinary.com/dzybcr4gg/image/upload/v1663076001/YelpCamp/gqwnc0clzs21ihnb5so4.jpg",
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
