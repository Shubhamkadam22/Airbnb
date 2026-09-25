const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');
const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlsbGF8ZW58MHx8MHx8fDA%3D";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default: DEFAULT_IMAGE_URL,
      set: (v) => (v === "" ? DEFAULT_IMAGE_URL : v),
    },
  },
  price: { type: Number, default: 0 },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId, 
      ref: "Review"
    }

  ]
});


listingSchema.post("findOneAndDelete" , async (listing) => {
  if (listing) {
    await Review.deleteMany ({ _id: {$in: listing.reviews}});
  }
}); 


const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing; 

