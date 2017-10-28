// server.js

// set up ======================================================================
var express  = require('express');	// express server
var app      = express();	//app uses the express server
var port     = process.env.PORT || 8080;	// default port 8080, or whatever server settings tell it

var morgan       = require('morgan');	// Morgan sets some default logging behavior for requests and errors
var bodyParser   = require('body-parser');	// we need to access the body of HTML requests
var session      = require('express-session');	// persistent session information
const uuid = require('uuid/v1');	// package for generating UUIDs. v1 tells it which standard to follow.


// set up our express application
if(process.env.NODE_ENV !== 'test') {	// Don't log with Morgan in test environment
	app.use(morgan('dev')); // log every request to the console
}
app.use(bodyParser.urlencoded({	// format for encoding HTML body
    extended: true	// allows nested objects and arrays
}));
app.use(bodyParser.json());	// encoding for JSON data


app.use(session({	// keep track of user sessions, and attach them to 
	genid: function(req) {	// tell express how to generate session IDs
    return uuid(); // use UUIDs for session IDs
  },
  secret: 'InAProductionAppThisWouldNotBeOnPublicGithub', //session secret for security
  saveUninitialized: true,	// save sessions on start, even before they've been modified
  resave: false	// don't resave sessions that have not changed, on every request
 })); // session secret

require('./app/routes.js')(app); // load our routes and pass in our app

app.listen(port); // Listen for incoming requests to the server
console.log('Listening on port ' + port);
module.exports = app;	// for testing