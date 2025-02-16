dotenv = require("dotenv").config();

const express = require("express");
const app = express();
const morgan = require("morgan");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");


// Create a .env file to use process.env
let port = process.env.PORT; // OR let port = '3001'
let host = process.env.HOST;
// let host = 'localhost'
// let port = '3001'




app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(flash());
app.use(
  session({
    secret: process.env.TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// Global base directory for file downloads
global.__basedir = __dirname;

// EJS initialization
app.set("view engine", "ejs");
// Static page
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// log requests
app.use(morgan('tiny'))




// Route setup
const path = require("path");
app.use( require("./server/routes/router"));


// // Import routes
// const authRoute = require('./server/routes/auth')
// const postRoute = require('./server/routes/posts')

// // Route Middleware (/api/user is prefixed for the auth.js routes)
// app.use('/api/user', authRoute)
// app.use('/api/posts', postRoute)
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("./server/middlewares/auth");
app.use(methodOverride("_method"));

app.get("/", checkAuthenticated, (req, res) => {
     res.header(
       "Cache-Control",
       "private, no-cache, no-store, must-revalidate"
     );
  res.render("index", { name: req.user.name });
});

app.delete("/logout", checkAuthenticated, async (req, res) => {
  await req.logOut();
  if (!req.user)
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.redirect("/login");
});



// connect to database
const connectDB = require("./server/database/connection");
// mongoDB conncection
connectDB();


// Cross Origin Whitelist
// const cors = require("cors");
// const allowedOrigins = [
//   `http//:${host}:${port}`,
//   "https://cloud.mongodb.com",
// ];
// app.use(
//     cors({
//         origin: function(origin, callback) {
//             if (!origin) return callback(null, true);
//             if (allowedOrigins.indexOf(origin) === -1) {
//                 var msg =
//                     "The CORS policy for this site does not " +
//                     "allow access from the specified Origin.";
//                 return callback(new Error(msg), false);
//             }
//             return callback(null, true);
//         },
//     })
// );
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });






// Error page
app.use(function(req, res) {
    res.status(404);
    res.render("404");
});

// Error page
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.type("plain/text");
    res.status(500);
    res.render("500");
});


app.listen(port, host, () => {
    console.log(
        `Express started \on http//:${host}:${port} press Ctrl-C to terminate.`
    );
});