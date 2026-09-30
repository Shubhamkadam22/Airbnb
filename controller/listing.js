 const Listing = require("../models/listing");


 module.exports.indexListing = async (req ,res ) =>{
  const allListings = await  Listing.find({});// Fetch all listings from the database and convert to plain JavaScript objects
  res.render("listings/index.ejs", { allListings });
};



module.exports.new = async (req, res) => {
    res.render("listings/new.ejs");
 };

//show listing 
module.exports.showListing  = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({path: "reviews",
    populate: {
      path: "author", 
    },
  })
  .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings"); // Stops execution here and redirects safely
  } 
  res.render("listings/show.ejs", { listing });
}


module.exports.editnewListing = async (req ,res , next) =>{
    const newListing =  new Listing (req.body.listing);
    newListing.owner = req.user._id; 
    await newListing.save();
    req.flash("success", "New Listing Created"); 
    res.redirect("/listings");
  }



// //edit route controller 

module.exports.editListing = async (req ,res ) =>{
  const { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("success", "Listing edit successfully"); 
  res.render("listings/edit.ejs", { listing });
}

// //update route controller 

module.exports.updateListing = async (req ,res ) =>{
  const { id } = req.params;
  let listing = await Listing.findById(id); 
  await Listing.findByIdAndUpdate(id , { ...req.body.listing });
  req.flash("success", "Listing Updated successfully"); 
  res.redirect(`/listings/${id}`);
}


// //deletelisting route controller 

module.exports.deleteListing = async (req ,res ) =>{
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log(`Listing with ID ${id} has been deleted.`);
  req.flash("success", "Listing deleted"); 
  res.redirect("/listings");
}

