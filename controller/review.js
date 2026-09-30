// const Listing = require("../models/review");


// module.exports.reviewShow = async (req, res) => {
//   let listing = await Listing.findById(req.params.id); 
//   let newReview = new Review(req.body.review); 
//   newReview.author = req.user._id; 
//   listing.reviews.push(newReview);
//   await newReview.save();
//   await listing.save(); 
//   req.flash("success", "Review created successfully"); 
//   res.redirect(`/listings/${req.params.id}`); 
// };

