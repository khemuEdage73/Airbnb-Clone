const express = require("express");
const router = express.Router();
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const CustomError = require("../error.js");
const asyncWrapper = require("../utils.js");


const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new CustomError(msg, 400);
  }
  next();
};

router.post("/", validateReview, asyncWrapper(async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);
  if(!listing){
    throw new CustomError("no listing with this id", 400);
  }
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await listing.save();
  await newReview.save();

  console.log(req.body.review);
  res.redirect(`/listings/${id}`);
}));

//delete review
router.delete("/:reviewId", async(req, res) =>{
  const {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId }});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);

})


module.exports = router;