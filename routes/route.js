
var google=require('googleapis');

var gmail=google.gmail('v1');

var appRouter= function (app)
{	app.get("/",function(req,res){
		res.send("Hello World");
	});
	app.post("/",function(req,res){
		var obj=req.body
		var auth=req.body.auth;
		gmail.users.messages.list({
		    auth:auth,
		    userId:'me',
		    labelIds:['CATEGORY_PERSONAL'],
		    maxResults:100,
		  },function(err,response){
		  		res.json(response);
		  });
		
	});
}
module.exports=appRouter;