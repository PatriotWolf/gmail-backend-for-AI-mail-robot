var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var google=require('googleapis');
var OAuth2 = google.auth.OAuth2;


var googleAuth = require('google-auth-library');
var verifier = require('google-id-token-verifier');
var request = require('request');
var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(
  "916867267412-61vafvip23245d2hqmqujjvmbm5vjklq.apps.googleusercontent.com",
  "C4Bmg6RpT9KWk-Srkk6miSfp",
  "https://api.ionic.io/auth/integrations/google?app_id=4c4b9672"
);

var gmail=google.gmail('v1');
var credentials;

//read app credentials


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
		//var obj=req.body
		var token=req.body.auth;
		var id=req.body.clientID;
		console.log(token);
		//use the access code
			oauth2Client.setCredentials(token);
		gmail.users.messages.list({
		    auth:oauth2Client,
		    userId:'me',
		    labelIds:['CATEGORY_PERSONAL'],
		    maxResults:10,
		  },function(err,response){
		  		if(err)
		  	{		res.json("you got error");


		  	}
		  	res.json(response);

		  });


	});
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

//Start the server 
app.listen(port);
console.log('Magic happens on port ' + port);