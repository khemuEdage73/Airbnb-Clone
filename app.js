//imports
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const engine = require('ejs-mate');

//const variables
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method",{
  method:["POST", "GET"]
}));
app.engine('ejs', engine);

//connection db
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnbclone");
}

main()
  .then(() => console.log("connection to DB successful."))
  .catch((err) => console.log(err));

  app.get("/", (req, res) =>{
    res.send("Hello");
  })

//all listings
app.get("/listings", async (req, res) => {
  let listings = await Listing.find();
  res.render("listings.ejs", { listings });
});

//new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.post("/listings/new", async (req, res) => {
  let listing = req.body;
  try {
    let newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
  } catch (err) {
    console.log("Error while adding Listing", err);
  }
});

//show route
app.get("/listings/:id", async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//Update Route

app.get("/listings/:id/edit", async(req, res) =>{
  let id = req.params.id;
  let listing = await Listing.findById(id);
  console.log(listing);
  res.render("listings/edit.ejs", {listing})
})

app.put("/listings/:id", async(req, res) =>{
  let id = req.params.id;
  try{
      await Listing.findByIdAndUpdate(id, {...req.body});
      res.redirect("/listings");
  }
  catch(err){
    res.status(500).json(err);
  }
});

//delete Route
app.delete("/listings/:id", async (req, res) => {
  let id = req.params.id;
  console.log("I am here");
  try {
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  } catch (err) {
    console.log("Problem while deleting listing", err);
  }
});

app.listen(port, (req, res) => {
  console.log(`listening to the port${port}`);
});
