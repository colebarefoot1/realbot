// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');


// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration
require('./app/util/errors'); // register errors

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public/css')); //setup directory for static css content
app.use(express.static(__dirname + '/public/css/fonts')); //setup directory for static css content
app.use(express.static(__dirname + '/public/js')); //setup directory for static js content
app.use(express.static(__dirname + '/public/vendor')); //setup directory for static js content
app.use('/public/css', express.static(__dirname + '/public/css'));
app.use('/public/css/fonts', express.static(__dirname + '/public/css/fonts'));
app.use('/public/js', express.static(__dirname + '/public/js'));
app.use('/public/img', express.static(__dirname + '/public/img'));
app.use('/public/vendor', express.static(__dirname + '/public/vendor'));
app.use('/public/vendor/slick', express.static(__dirname + '/public/vendor/slick'));
app.use('/public/vendor/slick/fonts', express.static(__dirname + '/public/vendor/slick/fonts'));
app.use('/app', express.static(__dirname + '/app'));
app.use('/policy', express.static(__dirname + '/views/policy')); //static files for tos.pdf and privacy.pdf
//app.use(express.static(__dirname + '/app')); //setup directory app data
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================

app.listen(port);
console.log('The magic happens on port ' + port);
