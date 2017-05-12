var express=require('express');
var bodyParser=require('body-parser');
var app=express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: true}));
app.use(bodyParser.text({type: '*/*'}));



var route=require('./routes/route.js')(app);

var server= app.listen(process.env.port || 3000,function(){
	console.log("listening on port %s",server.address().port);
})