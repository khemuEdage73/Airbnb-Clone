//imports
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const engine = require("ejs-mate");
const {listingSchema, reviewSchema} = require("./schema.js");
const CustomError = require("./error.js");
const Review = require("./models/review.js");

//const variables
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  }),
);
app.engine("ejs", engine);

function asyncWrapper(fn) {
  let wrapper_func = (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
  return wrapper_func;
}

function validateListing(req, res, next) {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new CustomError(msg, 400);
  }
  next();
}

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new CustomError(msg, 400);
  }
  next();
}

//connection db
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnbclone");
}

main()
  .then(() => console.log("connection to DB successful."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello");
});

//all listings
app.get(
  "/listings",
  asyncWrapper(async (req, res) => {
    let listings = await Listing.find();
    res.render("listings.ejs", { listings });
  }),
);

//new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.post("/listings/new", validateListing, async (req, res) => {
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
app.get("/listings/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  } catch {
    next(new CustomError("Listing not found", 404));
  }
});

//Update Route
app.get("/listings/:id/edit", async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

app.put("/listings/:id", validateListing, async (req, res) => {
  let id = req.params.id;
  try {
    await Listing.findByIdAndUpdate(id, { ...req.body });
    res.redirect("/listings");
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete Route
app.delete("/listings/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const listing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  } catch (err) {
    console.log("Problem while deleting listing", err);
  }
});

//Reviews
app.post("/listings/:id/reviews", validateReview, asyncWrapper(async (req, res) => {
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
app.delete("/listings/:id/reviews/:reviewId", async(req, res) =>{
  const {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId }});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);

})


//error handling for other invalid routes
app.all("*splat", (req, res, next) => {
  next(new customError("Page not found", 404));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.render("error.ejs", { err: { statusCode, message } });
});

app.listen(port, (req, res) => {
  console.log(`listening to the port${port}`);
});
