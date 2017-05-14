var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var google=require('googleapis');
var googleAuth = require('google-auth-library');
var auth = new googleAuth;
var client = new auth.OAuth2('916867267412-61vafvip23245d2hqmqujjvmbm5vjklq.apps.googleusercontent.com','','')
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
		console.log();
		client.verifyIdToken(
		    auth,
		    '916867267412-61vafvip23245d2hqmqujjvmbm5vjklq.apps.googleusercontent.com',
		    // Or, if multiple clients access the backend:
		    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
		    function(e, login) {
		      var payload = login.getPayload();
		      var userid = payload['sub'];
		      var obj={"payload":payload,"userid":userid}
		      res.json(obj);
		      // If request specified a G Suite domain:
		      //var domain = payload['hd'];
	    });
	});
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

//Start the server 
app.listen(port);
console.log('Magic happens on port ' + port);