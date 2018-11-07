var quizController = require('../controllers/quiz.controller'),
    express = require('express'),
    passportService = require('../../config/auth');
    passport = require('passport');

var requireAuth = passport.authenticate('jwt',{session: false});
var requireLogin = passport.authenticate('local', {session:false});
module.exports = (app) => {
    app.post('/quiz/nextQuestion',quizController.nextQuestion);
}