var challengeController = require('../controllers/challenge.controller'),
    express = require('express'),
    passportService = require('../../config/auth');
    passport = require('passport');

var requireAuth = passport.authenticate('jwt',{session: false});
var requireLogin = passport.authenticate('local', {session:false});
module.exports = (app) => {
    app.post('/challenge/getQuestions',challengeController.getQuestions); // Get challenge questions
    app.get('/challenge',challengeController.challenge); // Challenege somebody
}