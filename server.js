// server.js

// set up ======================================================================
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;

var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var session      = require('express-session');
const uuid = require('uuid/v1');
const path = require('path');


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '..', 'build')));


app.use(session({
	genid: function(req) {
    return uuid(); // use UUIDs for session IDs
  },
  secret: 'HelloWorld!' })); // session secret

require('./app/routes.js')(app); // load our routes and pass in our app

app.listen(port);
console.log('Listening on port ' + port);