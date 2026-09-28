const mongoose = require('mongoose');
const initData = require("./data.js"); 
const Listing = require("../models/listing.js"); 


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



const initDB = async () => {
    await Listing.deleteMany({}); // Clear existing listings
    initData.data = initData.data.map((obj) => ({ ...obj , owner: "6aba4d75cbfa9d87e3aa5889"}));
    await Listing.insertMany(initData.data); // Insert new listings from data.js
    console.log("data was initialized successfully");
}
initDB(); 
