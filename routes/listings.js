const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const CustomError = require("../error.js");
const asyncWrapper = require("../utils.js");


function validateListing(req, res, next) {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new CustomError(msg, 400);
  }
  next();
}

//all listings
router.get(
  "/",
  asyncWrapper(async (req, res) => {
    let listings = await Listing.find();
    res.render("listings.ejs", { listings });
  }),
);

//new listing
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

router.post("/new", validateListing, async (req, res) => {
  let listing = req.body;
  console.log(listing);
  try {
    let newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
  } catch (err) {
    console.log("Error while adding Listing", err);
  }
});

// show route
router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  } catch {
    next(new CustomError("Listing not found", 404));
  }
});

//Update Route
router.get("/:id/edit", async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

router.put("/:id", validateListing, async (req, res) => {
  let id = req.params.id;
  try {
    await Listing.findByIdAndUpdate(id, { ...req.body });
    res.redirect("/listings");
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete Route
router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const listing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  } catch (err) {
    console.log("Problem while deleting listing", err);
  }
});


module.exports = router;