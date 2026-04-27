const mongoose = require("mongoose");


const listingSchema = new mongoose.Schema({
    title:{
          type: String,
          required: true
    },
    description:{
          type: String,
    },
    image: String,
    price: Number,
    location:{
        type:String,
        required: true
    },
    country:String,
});



const Listing = mongoose.model("listing", listingSchema);

module.exports = Listing;