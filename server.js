// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    	= require('express'); 		// call express
var bodyParser 	= require('body-parser');
var http		= require('http');

var app        	= express(); 				// define our app using express

app.use("/public", express.static(__dirname + '/public'));

//MongoDB connection - START
var mongoose	= require('mongoose');
mongoose.connect('mongodb://localhost/gameswap');
var db 			= mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay! 
});
//MongoDB connection - END

// Defining Models - START

// Defining Models - START


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	
	//TODO: Authentication
	/* *
	 * - Check the token if valid,
	 * - - Not Valid, throw 401 ([App] - Proceed to login page)
	 * 
	 * - Check user/password if valid, else throw 401
	 * - - for valid, create new token and expiry (user.login.expire is < current time)
	 * 
	 * */
	

	
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to Game Swap api!' });	
});



//-------------------------------------------------------- THER DIRTY WORKS - START

// more routes for our API will happen here
var games = require('./routes/games');
app.use('/api/games', games);

var users = require('./routes/users');
app.use('/api/users', users);

var collections = require('./routes/collections');
app.use('/api/collections', collections);

var transactions = require('./routes/transactions');
app.use('/api/transactions', transactions);

var search = require('./routes/search');
app.use('/api/search', search);

var notifications = require('./routes/notifications');
app.use('/api/notifications', notifications);
//-------------------------------------------------------- THER DIRTY WORKS - END


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
//console.log('Magic happens on port ' + port);
