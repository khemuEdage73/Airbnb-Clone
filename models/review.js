const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating: Number,
    msg: String,
    createdAt : {
        type: Date,
        default: Date.now()
    }
})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;