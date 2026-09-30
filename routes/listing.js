const express = require('express');
const router = express();
const wrapAsync = require('../utils/wrapAsync'); // Correct for CommonJS // Import the wrapAsync utility
const {listingSchema , reviewSchema} = require("../schema.js"); 
const ExpressError = require('../utils/expressError.js'); // Import the ExpressError class
const Listing = require('../models/listing'); // Import the Listing model
const {isLoggedIn } = require("../middleware.js");
const controllerListing = require("../controller/listing.js")
const {validateListing} = require("../middleware.js")



//index route 
router.get("/" , wrapAsync( controllerListing.indexListing));


// New Route 
router.get("/new", 
  isLoggedIn, 
wrapAsync(controllerListing.new)
);


//show route 
router.get("/:id", wrapAsync( controllerListing.showListing));


// create a new listing
router.post("/" ,
  isLoggedIn,
  validateListing, 
   wrapAsync( controllerListing.editnewListing)
);

//edit route 
router.get("/:id/edit" , isLoggedIn, 
  wrapAsync(controllerListing.editListing));


//update route
router.put("/:id" ,validateListing,  isLoggedIn, 
  wrapAsync( controllerListing.updateListing ));

//delete route
router.delete("/:id" , isLoggedIn,   wrapAsync( controllerListing.deleteListing));



module.exports = router; 