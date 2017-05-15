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
  "795974387130-b1m7fs0kjvcu1f5ekhkldr8qvts4eka6.apps.googleusercontent.com",
  "zojXxtayp7rMkN5-SjzpN1fk",
  "https://api.ionic.io/auth/integrations/google?app_id=c173370c"
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
		oauth2Client.getToken(token, function (err, tokens) {
		  // Now tokens contains an access_token and an optional refresh_token. Save them.
		  if (!err) {
		    oauth2Client.setCredentials(tokens);
		    console.log(oauth2Client);
			gmail.users.messages.list({
			    auth:oauth2Client,
			    userId:'me',
			    labelIds:['CATEGORY_PERSONAL'],
			    maxResults:10,
			  },function(err,response){
			  		if(err)
			  	{		res.json("error :" + err);


			  	}
			  	else{res.json(response);}

			  });
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