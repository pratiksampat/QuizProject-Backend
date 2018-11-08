var jwt = require('jsonwebtoken'); 
var User = require('../models/user');
var authConfig = require('../../config/auth');
var questionnaire = require('../models/quizdata');
var filtertered = [];
var prev_level = 0;
exports.nextQuestion = async function(req, res, next){
    var email = req.headers.email;
    var level = req.body.level;

    var user = await User.findOne({email:email});
    if(!user)
        return res.status(422).send({error: 'No user found'});

    //Get a random object
    if(prev_level != level){
        console.log("Entered");
        prev_level = level;
        questionnaire1 = JSON.stringify(questionnaire);
        JSON.parse(questionnaire1, function(key, value) {
        if ( value.level === level ) { filtertered.push(value); }
        return value; })
    }
    
    var obj_keys = Object.keys(filtertered);
    var ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
    var selected_question = filtertered[ran_key];
    console.log(ran_key);
    console.log(filtertered[ran_key]);
    delete filtertered[ran_key]; // detele that so that unique random

    res.status(200).send(selected_question);
}