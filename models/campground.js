const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema; //shortcut

const CampGroundSchema = new Schema({
  title: String,
  image: [{ url: String, filename: String }],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//CAMPGROUND SİLİNDİĞİNDE REVİEWLARINDA SİLİNMESİ
CampGroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampGroundSchema);
