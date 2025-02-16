require("dotenv").config();
const express = require("express");

const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const User = require("../model/User");
const Quiz = require("../model/quiz")
const bcrypt = require("bcryptjs");
const app = express();
const methodOverride = require("method-override");

const initializePassport = require("../../passport-config");
initializePassport(
  passport,
  async (email) => {
    const userFound = await User.findOne({ email });
    return userFound;
  },
  async (id) => {
    const userFound = await User.findOne({ _id: id });
    return userFound;
  }
);


app.use(flash());
app.use(
  session({
    secret: process.env.TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
app.use(methodOverride("_method"));

// ========================================================
// GET
// ========================================================
// Donnyves
exports.homeRoutes = (checkAuthenticated,(req, res) => {
     res.header(
       "Cache-Control",
       "private, no-cache, no-store, must-revalidate"
     );
  res.render("index", { name: req.user.name });
})
// Donnyves
exports.login = (checkNotAuthenticated,(req, res) => {
  res.render("login", { login_form_greeting: "SIGN IN TO YOUR ACCOUNT" });
})

exports.register = (checkNotAuthenticated,(req, res) => {
  res.render("register" ,{register_form_greeting:"Register"});
})


// ========================================================
// POST
// ========================================================
// Donnyves
exports.post_login = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true, // shows messages from passort.config
});

// Donnyves
exports.post_register =
  ("/register",
  checkNotAuthenticated,
  async (req, res) => {
    
    const userFound = await User.findOne({ email: req.body.email });

    if (userFound) {
      req.flash("error", "User with that email already exists");
      res.redirect("/register");
    } else {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });

        await user.save();
         res.redirect("/login");
      } catch (error) {
        console.log(error);
        res.redirect("/register");
      }
    }
  });



// Donnyves
exports.post_delete =
  (checkAuthenticated,
  async (req, res, next) => {
  await req.logOut();
  if (!req.user)
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.redirect("/login");
  });

// ========================================================


// ========================================================
// Donnyves
exports.welcome = (checkAuthenticated,(req, res) => {
  
  res.render("layouts/welcome", { name: req.user.name });
});
// Aaron
exports.quizzes =
  (checkAuthenticated,
  (req, res) => {
      res.header(
        "Cache-Control",
        "private, no-cache, no-store, must-revalidate"
      );
    res.render("quizzes", { name: req.user.name });
  });
// Aaron
exports.create_quiz =
  (checkAuthenticated,
  (req, res) => {
      res.header(
        "Cache-Control",
        "private, no-cache, no-store, must-revalidate"
      );
    res.render("create_quiz", { name: req.user.name });
  });
// Aaron
exports.post_create_quiz =
  ("/create_quiz",
  checkAuthenticated,
  async (req, res) => {
    console.log(req.body);
    try {
      const quiz = new Quiz({
        name: req.body.name,
        owner: req.body.owner,
      });
      await quiz.save();
      await res.redirect("/quizzes");
      res.status(201);
    } catch (error) {
      console.log(error);
      res.redirect("/create_quiz");
    }
  });
// Aaron
exports.quiz_results =
  (checkAuthenticated,
  (req, res) => {
      res.header(
        "Cache-Control",
        "private, no-cache, no-store, must-revalidate"
      );
    res.render("quiz_results", { name: req.user.name });
  });
// Aaron
exports.create_question =
  (checkAuthenticated,
  (req, res) => {
      res.header(
        "Cache-Control",
        "private, no-cache, no-store, must-revalidate"
      );
    let quizId = req.params.quizId;
    res.render(
      "create_question", 
      { quizId:quizId, name: req.user.name  }
    
    );
  });


//Dominique
exports.canidate_quiz = (req, res) => {
  res.render("canidate_quiz", { name: req.user.name });
};
//Dominique
exports.canidate_survey = (req, res) => {
  res.render("canidate_survey", { name: req.user.name });
};
//Dominique
exports.canidate_complete = (req, res) => {
  res.render("canidate_complete", { name: req.user.name });
};
