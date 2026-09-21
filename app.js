const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing'); // Import the Listing model
const path = require('path');
const methosOverride = require('method-override');
const ejsMate= require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js'); // Import the wrapAsync utility

const ExpressError = require('./utils/expressError.js'); // Import the ExpressError class







// Middleware to override HTTP methods
app.use(methosOverride('_method'));
// Middleware to parse URL-encoded data

// to use static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
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




app.get("/listings" , wrapAsync(async (req ,res ) =>{
  const allListings = await  Listing.find({});// Fetch all listings from the database and convert to plain JavaScript objects
  res.render("listings/index.ejs", { allListings });
}));

// New Route 


app.get("/listings/new" , (req ,res ) =>{
  res.render("listings/new.ejs");
  
});



app.get("/listings/:id" , wrapAsync(async (req ,res ) =>{
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

// create a new listing
app.post("/listings" ,
   wrapAsync(async (req ,res , next) =>{

    if(!req.body.listing) {
      throw new ExpressError(400 , "Invalid Listing Data");
    }
    const newListing =  new Listing (req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);


//edit route 
app.get("/listings/:id/edit" , wrapAsync(async (req ,res ) =>{
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));


//update route
app.put("/listings/:id" , wrapAsync(  async (req ,res ) =>{
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id , { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id" , wrapAsync(async (req ,res ) =>{
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log(`Listing with ID ${id} has been deleted.`);
  res.redirect("/listings");
}));


app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let {statusCode , message }  = err;
    res.status(statusCode).send(message);
});


// Start the server
app.listen(8080 , () => {
    console.log('Server is running on port 8080');
});