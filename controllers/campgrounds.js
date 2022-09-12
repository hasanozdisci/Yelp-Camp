const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

// ALL CAMPGROUNDS
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

// NEW CAMPGROUND PAGE
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

// CREATE NEW CAMPGROUND
module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  res.send(geoData.body.features[0].geometry.coordinates);
  // res.send("OK!!")
  // if (!req.body.campground)
  //   throw new ExpressError("Invalid Campground Data", 400);
  // const campground = new Campground(req.body.campground);
  // campground.images = req.files.map((f) => ({
  //   url: f.path,
  //   filename: f.filename,
  // }));
  // campground.author = req.user._id;
  // // console.log(campground.author)
  // await campground.save();
  // console.log(campground);
  // req.flash("success", "Successfully made a new campground!");
  // res.redirect(`/campgrounds/${campground._id}`);
};

// SHOW PAGE
module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  // console.log(campground);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

// EDİT PAGE
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

// UPDATE CAMPGROUND
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  // console.log(req.body)
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  // delete images in edit page
  if (req.body.deleteImages) {
    // delete images from cloudinary
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    // console.log(campground)
  }
  req.flash("success", "Succesfully uptated campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

// DELETE CAMPGROUND
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};
