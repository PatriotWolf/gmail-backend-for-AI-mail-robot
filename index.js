var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var fs = require('fs');
var google=require('googleapis');
var googleAuth = require('google-auth-library');
var googlecontent;
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
		googlecontent=content;
		console.log("read the client secret")
});
var auth = new googleAuth();
var gmail=google.gmail('v1');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.post('/',function(req,res){
		var obj=req.body
		var auth=req.body.auth;
		var id=req.body.clientID;
		var clientSecret = credentials.installed.client_secret;
	 	var clientId = credentials.installed.client_id;
	  	var redirectUrl = credentials.installed.redirect_uris[0];
	  	 var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
		oauth2Client.getToken(req.body.auth, function (err, tokens) {
		  res.json(tokens)
		  // Now tokens contains an access_token and an optional refresh_token. Save them.
		  if (!err) {
		    oauth2Client.setCredentials(tokens);
		  }
		});
	});
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

//Start the server 
app.listen(port);
console.log('Magic happens on port ' + port);