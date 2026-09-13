const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing'); // Import the Listing model
const path = require('path');
const methosOverride = require('method-override');

// Middleware to override HTTP methods
app.use(methosOverride('_method'));
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// MongoDB connection URI
const  MONGO_URI = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URI);
}

//calling main function to connect to the database
main().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});


// Define a route for the root URL
app.get('/', (req, res) => {    
  res.send('Hello World');
});     




app.get("/listings" , async (req ,res ) =>{
  const allListings = await  Listing.find({});// Fetch all listings from the database and convert to plain JavaScript objects
  res.render("listings/index.ejs", { allListings });
});

// New Route 


app.get("/listings/new" , (req ,res ) =>{
  res.render("listings/new.ejs");
  
});



app.get("/listings/:id" , async (req ,res ) =>{
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// create a new listing
app.post("/listings" , async (req ,res ) =>{
 const newListing =  new Listing (req.body.listing);
 await newListing.save();
 res.redirect("/listings");
});


//edit route 
app.get("/listings/:id/edit" , async (req ,res ) =>{
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});


//update route
app.put("/listings/:id" , async (req ,res ) =>{
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id , { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id" , async (req ,res ) =>{
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log(`Listing with ID ${id} has been deleted.`);
  res.redirect("/listings");
});

// Start the server
app.listen(8080 , () => {
    console.log('Server is running on port 8080');
});