var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var google=require('googleapis');

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

app.post('/',function(req,res){
		var obj=req.body
		var auth=req.body.auth;
		//res.json(req.body);
		gmail.users.messages.list({
		    auth:auth,
		    userId:'me',
		    labelIds:['CATEGORY_PERSONAL'],
		    maxResults:100,
		  },function(err,response){
		  	 if(err){
		        res.json(err);
		        return;
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