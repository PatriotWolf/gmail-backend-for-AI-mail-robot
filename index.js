var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var admin = require("firebase-admin");
var dir=__dirname;
var serviceAccount = require(dir+"/idm-lab-email-robot-firebase-adminsdk-hmrrv-7c17e0643b.json");
//Firebase setup
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://idm-lab-email-robot.firebaseio.com"
});




//Google Setup
var google=require('googleapis');
var OAuth2 = google.auth.OAuth2;


var googleAuth = require('google-auth-library');
var verifier = require('google-id-token-verifier');
var request = require('request');
var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(
  "279920076626-a3otvdte7q7vljcfa70k6ogd3a9vofh1.apps.googleusercontent.com",
  "s8iCZQJH8UBRYRtiHknIlsOg",
  "https://idm-lab-email-robot.firebaseapp.com/__/auth/handler"
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
		var reqObj=req.body

		var token=reqObj.serverAuthCode;
		var id=req.body.userId;
		console.log(token);
		//use the access code
		
		oauth2Client.getToken(token, function (err, tokens) {
		  // Now tokens contains an access_token and an optional refresh_token. Save them.
		 console.log(tokens);
		 
		  if (!err) {
		    oauth2Client.setCredentials(tokens);
		    console.log(oauth2Client);
		    if(tokens.hasOwnProperty('refreshtoken'))
		    {
		    		    reqObj.refresh_token=tokens.refresh_token
		    }
		    var db=admin.database();
			var ref =db.ref("users");
			//OBTAIN VALUE FROM DATABASE
			ref.orderByChild("id").equalTo(id).once("value",function (snapshot){
				 if(snapshot.val() !== null){
				 	//res.json('user ' + id + ' exists!');
				 	var obj=snapshot.val();
				 	obj= Object.keys(obj)
				 	obj=obj[0];
				 	if(tokens.hasOwnProperty('refreshtoken'))
				    {
				    		    obj.refresh_token=tokens.refresh_token
				    }
				    obj.tokens=tokens;

				 	storedid=snapshot.val()[obj].id;
	 				storedToken=snapshot.val()[obj].auth;
	 				
	 				
	 					
	 					gmail.users.messages.list({
						    auth:oauth2Client,
						    userId:'me',
						    labelIds:['CATEGORY_PERSONAL','UNREAD'],
						    maxResults:10,
						  },function(err,response){
						  		if(err)
						  	{		res.json("error :" + err);


						  	}
						  	else{
						  		res.json(response);
						  		//admin.database().goOffline();
						  		//console.log(ref.child(obj).set(reqObj));
						  	}

						  });
	 				
				 }
				 else {
					  var usersRef=ref
				     	usersRef=usersRef.push();
						reqObj.client_id="279920076626-ldn2ip0ga9b8bner33lqnq7jqga8n048.apps.googleusercontent.com";
				    	reqObj.client_secret="x6_DJWgP13SlToWEM_hCedz7";
						usersRef.set(reqObj);
					res.json("success")
					//admin.database().goOffline();
			  	}
			    
				
			});
		    
			// gmail.users.messages.list({
			//     auth:oauth2Client,
			//     userId:'me',
			//     labelIds:['CATEGORY_PERSONAL','UNREAD'],
			//     maxResults:10,
			//   },function(err,response){
			//   		if(err)
			//   	{		res.json("error :" + err);


			//   	}
			//   	else{res.json(response);}

			//   });

		  }
		  else
		  {	res.json(err)
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