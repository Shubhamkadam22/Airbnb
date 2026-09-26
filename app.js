const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing'); // Import the Listing model
const path = require('path');
const methosOverride = require('method-override');
const ejsMate= require('ejs-mate');
const ExpressError = require('./utils/expressError.js'); // Import the ExpressError class
const listings = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js"); // Import the Listing model
const session = require("express-session") ;
const flash = require("connect-flash"); 

app.use(methosOverride('_method'));                 // Middleware to override HTTP methods
app.use(express.static(path.join(__dirname, 'public')));     // to use static files from the public directory
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sessionOptions = {
secret: "mysupersecretcode",
resave: false , 
saveUninitialized: true,
cookie:{
 expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
 maxAge: 7 * 24 * 60 * 60 * 1000,
 httpOnly: true, 

}
}

app.get('/', (req, res) => {          // Define a route for the root URL
  res.send('Hello World');
}); 

app.use(session(sessionOptions));
app.use(flash());

const  MONGO_URI = "mongodb://127.0.0.1:27017/wanderlust";     // MongoDB connection URI
async function main() {
    await mongoose.connect(MONGO_URI);
}

main().then(() => {                             //calling main function to connect to the database
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

app.use((req , res , next) => {
    res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
    next(); 
})


app.use("/listings" , listings); 
app.use("/listings/:id/reviews", reviewRouter);

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
});



app.listen(8080 , () => {          // Start the server
    console.log('Server is running on port 8080');
});