var jwt = require('jsonwebtoken'); 
var User = require('../models/user');
var authConfig = require('../../config/auth');
var questionnaire = require('../models/quizdata');
const events = require('events');
const Stream = new events.EventEmitter();
var data = null;
exports.getQuestions = async function(req, res, next){
    var email = req.headers.email;
    var challenger = req.body.challenger;
    var challengee = req.body.challengee;
    var numberQuestions = 10 ; 
    var len = 271;

    if(email == challengee || email == challenger){
        return res.status(422).send({error: 'Cannot challenge yourself! I mean you can but no :)'});
    }
    var user = await User.findOne({email:email});
    if(!user)
        return res.status(422).send({error: 'No user found'});
    if(!challenger){ // First person to take the quiz
        var questions = JSON.parse(JSON.stringify(questionnaire), function(key, value) {
            return value; 
        },function(err){
            console.log(err);
        });
        var questionList = []
        for(var i=0; i<numberQuestions; i++){
            var key = getRandomkey(0,len);
            questionList.push(questions[0][key]);
        }
        // user['challenge'].append(questionList);
        // console.log(user.challenge);
        // questionList[0]["challengee"] = challengee;
        var user = await User.findOne({email:challengee});
        var data = {
            challenger: email,
            questions: questionList
        }
        user.challenge.push(data);
        try{
            await user.save();
        }catch(err){
            return res.status(422).send({error: err});
        }
        
        res.status(200).send(data);
    }
    else{ // Who has challeneged is given then retreieve from their db
        for(var i=0; i<user.challenge.length; i++){
            if(user.challenge[i].challenger == challenger){
                res.status(200).send(user.challenge[i]);
            }
        }
    }
    
}

//Find somebody to challenege and send them a challenge request
exports.FindChallenge = async function(req, res, next){
    var email = req.headers.email;
    var user = await User.findOne({email:email});
    if(!user)
        return res.status(422).send({error: 'No user found'});
    var num = await User.countDocuments();

    var R = Math.floor(Math.random() * num)
    var chal = await User.findOne().limit(1).skip(R);
    var chal = await User.findOne();
    while(chal.email == user.email){
        R = Math.floor(Math.random() * num)
        chal = await User.findOne().limit(1).skip(R);
    }
    res.status(200).send({"user": chal});
}

exports.challenge = async function(req,res,next){
    var email = req.headers.email;
    var chal = req.body.chal;    
    // res.write("done");
    // res.end();
    data = {
        "challenger_email": email,
        "challengee_email": chal
    }
    Stream.emit("challengeEvent", data);
    res.send({"success": "challenged"});
}

exports.sse = async function(req, res, next){
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');
    Stream.once('challengeEvent', function(data){
        var dat = JSON.stringify(data);
        var final_data = "data: " + dat + "\n\n";
        res.write(final_data);
    });
}

exports.getAllChallenges = async function(req,res,next){
    var email = req.headers.email;
    var user = await User.findOne({email:email});
    if(!user)
        return res.status(422).send({error: 'No user found'});
    return res.status(200).send({"challenges": user.challenge});
}

exports.deleteChallenge = async function(req,res,next){
    var email = req.headers.email;
    var chal = req.body.chal;
    var user = await User.findOne({email:email});
    if(!user)
        return res.status(422).send({error: 'No user found'});
    // console.log(user.challenge[0]);
    // console.log(user.challenge[2].challenger);
    for(var i=0; i<user.challenge.length; i++){
        if(user.challenge[i].challenger == chal){
            console.log("Entered");
            user.challenge.splice(i,1);
        }
    }
    try{
        await user.save();
    }
    catch(err){
        console.log(err);
    }
    return res.status(200).send({"success": "success"});
    
}

function getRandomkey(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }