//imports
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const engine = require("ejs-mate");
const CustomError = require("./error.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const asyncWrapper = require("./utils.js");


//const variables
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("ejs", engine);
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  }),
);


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


app.use("/listings", listingRouter);
//Reviews
app.use("/listings/:id/reviews", reviewRouter);


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
