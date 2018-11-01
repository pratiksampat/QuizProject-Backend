var jwt = require('jsonwebtoken'); 
var User = require('../models/user');
var authConfig = require('../../config/auth');

function generateToken(user){
    return jwt.sign(user, authConfig.secret, {
        expiresIn: 10080
    });
}
 
function setInfo(request){
    return {
        _id: request._id,
        email: request.email,
    };
}
 

exports.login = function(req, res, next){
 
    var userInfo = setInfo(req.user);
 
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
 
}
 
exports.register = function(req, res, next){
 
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    

    if(!email){
        return res.status(422).send({error: 'You must enter an email address'});
    }
 
    if(!password){
        return res.status(422).send({error: 'You must enter a password'});
    }
 
    User.findOne({email: email}, function(err, existinguser){
 
        if(err){
            return next(err);
        }
 
        if(existinguser){
            return res.status(422).send({error: 'That email address is already in use'});
        }
 
        var user = new User({
            email: email,
            password: password,
            name:name      
        });

        user.save(function(err, user){
 
            if(err){
                return next(err);
            }
 
            var userInfo = setInfo(user);
 
            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            })
 
        });
 
    });
}

