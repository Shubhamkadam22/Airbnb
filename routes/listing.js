const express = require('express');
const router = express();
const wrapAsync = require('../utils/wrapAsync'); // Correct for CommonJS // Import the wrapAsync utility
const {listingSchema , reviewSchema} = require("../schema.js"); 
const ExpressError = require('../utils/expressError.js'); // Import the ExpressError class
const Listing = require('../models/listing'); // Import the Listing model


const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
    
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); 
    throw new ExpressError(400, errMsg); 
  } else {
    next(); 
  }
};


router.get("/" , wrapAsync(async (req ,res ) =>{
  const allListings = await  Listing.find({});// Fetch all listings from the database and convert to plain JavaScript objects
  res.render("listings/index.ejs", { allListings });
}));

// New Route 


router.get("/new" , (req ,res ) =>{
  res.render("listings/new.ejs");
  
});

//show route 
router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings"); // Stops execution here and redirects safely
  } 
  
  res.render("listings/show.ejs", { listing });
}));

// create a new listing
router.post("/" ,
  validateListing, 
   wrapAsync(async (req ,res , next) =>{
    const newListing =  new Listing (req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created"); 
    res.redirect("/listings");
  })
);


//edit route 
router.get("/:id/edit" , wrapAsync(async (req ,res ) =>{
  const { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("success", "Listing edit successfully"); 
  res.render("listings/edit.ejs", { listing });
}));


//update route
router.put("/:id" ,validateListing, wrapAsync(  async (req ,res ) =>{
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id , { ...req.body.listing });
  req.flash("success", "Listing Updated successfully"); 
  res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id" , wrapAsync(async (req ,res ) =>{
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log(`Listing with ID ${id} has been deleted.`);
  req.flash("success", "Listing deleted"); 
  res.redirect("/listings");
}));

module.exports = router; 