var authController = require('../controllers/auth.controller'),
    express = require('express'),
    passportService = require('../../config/auth');
    passport = require('passport');

var requireAuth = passport.authenticate('jwt',{session: false});
var requireLogin = passport.authenticate('local', {session:false});
module.exports = (app) => {
   app.post('/register',authController.register);
   app.post('/login',requireLogin,authController.login);
   app.get('/protec', requireAuth, function(req,res){
       res.send({
                email: req.user.email,
                name: req.user.name
                });
    //    console.log(req);
   });
   app.get('/',function(req,res){
       res.render('../views/test/index')
   })
   app.get('/login', function(req,res){
       res.render("../views/test/login");
   })
   app.get('/register', function(req,res){
       res.render('../views/test/register')
   })
}
