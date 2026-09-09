const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing'); // Import the Listing model
const path = require('path');

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


app.get("/listings/:id" , async (req ,res ) =>{
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

app.get("/listings/:id/edit" , async (req ,res ) =>{
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});
  
// app.get("/testListing" , async (req ,res ) =>{

//   let sampleListing = new Listing({
//     title: "Sample Listing",
//     description: "This is a sample listing.",
//     price: 100,
//     location: "xyz",
//     country: "xyz"
//   });
//   await sampleListing.save()
//   console.log("Sample listing saved to the database");
//   console.log(sampleListing);
//   res.send("Sample listing saved to the database");
// }); 


// Start the server
app.listen(8080 , () => {
    console.log('Server is running on port 8080');
});