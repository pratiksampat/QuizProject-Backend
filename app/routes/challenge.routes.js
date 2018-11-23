var challengeController = require('../controllers/challenge.controller'),
    express = require('express'),
    passportService = require('../../config/auth');
    passport = require('passport');

var requireAuth = passport.authenticate('jwt',{session: false});
var requireLogin = passport.authenticate('local', {session:false});
module.exports = (app) => {
    app.post('/challenge/getQuestions',requireAuth,challengeController.getQuestions); // Get challenge questions
    app.get('/challenge/FindChallenge',requireAuth,challengeController.FindChallenge); // Find a challenger
    app.post('/challenge',requireAuth,challengeController.challenge); // sse a challenger
    app.get('/stream', challengeController.sse);
    app.get('/challenge/getAllChallenges',requireAuth,challengeController.getAllChallenges);
    app.post('/challenge/deleteChallenge',requireAuth,challengeController.deleteChallenge)
}