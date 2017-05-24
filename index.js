var request = require("request");
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
		var id=reqObj.userId;
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
			ref.orderByChild("userId").equalTo(id).once("value",function (snapshot){
				 if(snapshot.val() !== null){
				 	//res.json('user ' + id + ' exists!');
				 	var obj=snapshot.val();
				 	obj= Object.keys(obj)
				 	obj=obj[0];
				 	
				    obj.tokens=tokens;

				 	storedid=snapshot.val()[obj].id;
	 				storedToken=snapshot.val()[obj].auth;
	 				console.log(ref.child(obj).set(reqObj));
	 				res.json("updated")
	 					
	 					// gmail.users.messages.list({
						 //    auth:oauth2Client,
						 //    userId:'me',
						 //    labelIds:['CATEGORY_PERSONAL','UNREAD'],
						 //    maxResults:10,
						 //  },function(err,response){
						 //  		if(err)
						 //  	{		res.json("error :" + err);


						 //  	}
						 //  	else{
						 //  		res.json(response);
						 //  		//admin.database().goOffline();
						 //  		//console.log(ref.child(obj).set(reqObj));
						 //  	}

						 //  });
	 				
				 }
				 else {
					  var usersRef=ref
				     	usersRef=usersRef.push();
				     	if(tokens.hasOwnProperty('refresh_token'))
					    {
					    		    reqObj.refresh_token=tokens.refresh_token;
					    }
					    delete reqObj["accessToken"];
					    reqObj.access_token=tokens.access_token;
						reqObj.client_id="279920076626-ldn2ip0ga9b8bner33lqnq7jqga8n048.apps.googleusercontent.com";
				    	reqObj.client_secret="x6_DJWgP13SlToWEM_hCedz7";
				    	reqObj._class="OAuth2Credentials";
				    	reqObj._module="oauth2client.client";
				    	reqObj.invalid="false";
				    	reqObj.token_expiry=tokens.expiry_date;
        				reqObj.token_uri="https://accounts.google.com/o/oauth2/token";
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
	
	router.post('/key',function(req,res){
		var reqObj=req.body;
		var id=reqObj.userId;
		var sender=reqObj.sender;
		var replyMail=[];
		
		var db=admin.database();
		var ref =db.ref("users");
		//OBTAIN VALUE FROM DATABASE
		ref.orderByChild("userId").equalTo(id).once("value",function (snapshot){
			if(snapshot.val() !== null){
				console.log(snapshot.val())
				var obj=snapshot.val();
				 	obj= Object.keys(obj)
				 	obj=obj[0];
				 	res.json(JSON.stringify({key:obj}));
				 	

			}
			else{
				res.json("error:You didn't register")
			}
		});


	});
	router.post('/true',function(req,res){
		var options = { method: 'POST',
		  url: 'http://13.76.181.19:9090/api/message',
		  headers: 
		   { 		     'content-type': 'application/json' },
		  body: 'are you okay?',
		  json: true };

		request(options, function (error, response, body) {
		  if (error) throw new Error(res.json(error));

		  res.json({response:body})
		});
		
	});
	router.post('/false',function(req,res){
		var options = { method: 'POST',
		  url: 'http://13.76.181.19:9090/api/message',
		  headers: 
		   { 		     'content-type': 'application/json' },
		  body: 'are you okay?',
		  json: true };

		request(options, function (error, response, body) {
		  if (error) throw new Error(res.json(error));

		  res.json({response:body})
		});
	});
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

//Start the server 
app.listen(port);
console.log('Magic happens on port ' + port);