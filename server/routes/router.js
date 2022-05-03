const express = require("express");
const route = express.Router();

const services = require("../services/render");

// Routes
route.get("/", services.homeRoutes);
route.get("/login", services.login);
route.get("/register", services.register);
route.get("/welcome", services.welcome);
<<<<<<< Updated upstream
route.get("/create_quiz", services.create_quiz);
route.get("/quiz_results", services.quiz_results);
route.get("/canidate_quiz", services.canidate_quiz);
route.get("/canidate_survey", services.canidate_survey);
route.get("/canidate_complete", services.canidate_complete);
=======
// Aaron
route.get("/quizzes", checkAuthenticated, services.quizzes);
route.get("/create_quiz", checkAuthenticated, services.create_quiz); 
route.post("/create_quiz", checkAuthenticated, services.post_create_quiz);
route.get("/quiz_results", checkAuthenticated, services.quiz_results);

route.get(
  "/create_question/:quizId",
  checkAuthenticated,
  services.create_question
);

//-----------------------------
//Dominique
route.get("/candidate_quiz", checkAuthenticated, services.candidate_quiz);
route.get("/candidate_survey", checkAuthenticated, services.candidate_survey);
route.get("/candidate_complete", checkAuthenticated, services.candidate_complete);
//-----------------------------
>>>>>>> Stashed changes


module.exports = route;
