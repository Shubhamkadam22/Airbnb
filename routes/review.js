const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync'); // Correct for CommonJS // Import the wrapAsync utility
const ExpressError = require('../utils/expressError.js'); // Import the ExpressError class
const {listingSchema , reviewSchema} = require("../schema.js"); 
const Review = require("../models/review"); // Import the Listing model
const Listing = require('../models/listing'); // Import the Listing model


const validateReview = (req, res, next) => {             //server side validation to prevent unotherized requests from postman , or hoppscoth
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); 
    throw new ExpressError(400, errMsg); 
  } else {
    next(); 
  }
};

// review route 
router.post("/", validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id); 
  let newReview = new Review(req.body.review); 
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save(); 
  res.redirect(`/listings/${req.params.id}`); 
}));


// Delete Review Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router; 