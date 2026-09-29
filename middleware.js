const Listing = require('./models/listing'); // Import the Listing model

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next(); // <-- Make sure 'next' is passed and called here!
};

module.exports.saveRedirectUrl = (req , res  , next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; 
    }
    next();
}

// module.exports.isOwner =  async (req , res  , next) => {
//   const { id } = req.params;
//   let listing = await Listing.findById(id); 
//   if (!listing.owner.locals(currUser._id)) {
//   req.flash("success", "Listing Updated successfully"); 
//   res.redirect(`/listings/${id}`);
//   }}