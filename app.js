var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var config = require('./config/config')
var passport = require('passport');
require('./config/passport.js')(passport);
mongoose.Promise = global.Promise;
var databaseConfig = require('./config/database');

mongoose.connect(databaseConfig.url,{ useNewUrlParser: true });

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./app/routes/auth.routes.js')(app);
// require('./app/routes/quiz.routes.js')(app);

app.listen(port = process.env.PORT || config.PORT,()=>{
    console.log(`Listening on port ${port}`);
});