const mongoose = require("mongoose");
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: String,
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: String,
  reviews: [
    {
      type:  mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async(data)=>{
  if(data){
    await Review.deleteMany({_id: {$in : data.reviews}});
  }
})

const Listing = mongoose.model("listing", listingSchema);

module.exports = Listing;
