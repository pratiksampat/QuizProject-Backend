var jwt = require('jsonwebtoken'); 
var User = require('../models/user');
var authConfig = require('../../config/auth');
var questionnaire = require('../models/quizdata');
exports.nextQuestion = async function(req, res, next){
    var email = req.headers.email;
    var level = req.body.level;

    var user = await User.findOne({email:email});
    if(!user)
        return res.status(422).send({error: 'No user found'});
    filtered = []
    JSON.parse(JSON.stringify(questionnaire), function(key, value) {
        if ( value.level === level ) { 
            filtered.push(value);
        }
        return value; 
    },function(err){
        console.log(err);
    });
    if(filtered.length == 0){
        return res.status(422).send({error: 'No question found'});
    }
    console.log(filtered.length);
    var key = getRandomkey(0,filtered.length);
    console.log(filtered[key]);
    res.status(200).send(filtered[key]);
}

function getRandomkey(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }