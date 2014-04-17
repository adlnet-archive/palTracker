 var express = require("express");
 var cookieParser = require("cookie-parser");
 var bodyParser = require("body-parser");
 var Guid = require('guid');
 var Datastore = require('nedb');
 var db = new Datastore({ filename: './data.db', autoload: true });

 var app = express();
 


app.use(new cookieParser()); 
//app.use(bodyParser);

app.set('layout', 'layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('.html', require('hogan-express'));
 /* serves main page */
 app.get("/", function(req, res) {
    res.sendfile('index.html')
 });


function CORSSupport(req, res, next) {
        
        if(req.headers['access-control-request-headers']) {
          res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        }else
        {
          res.header('Access-Control-Allow-Headers', 'Content-Type');
        }
        
        if(req.headers['Access-Control-Allow-Origin']) {
          res.header('Access-Control-Allow-Origin', req.headers.origin);
        }else
        {
          res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        }
        
        if(req.headers['access-control-request-method']) {
          res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        }else
        {
          res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        }
        
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
        
        if (req.method == 'OPTIONS') {
          res.send(200);
        }
        else
          next();
      }    


app.use(CORSSupport);

  /* serves main page */
 app.get("/banner", function(req, res) {
    
    console.log('banner');
    var cookie = req.cookies.PALTracker;
    if(!cookie)
    {
    	var newTracker = Guid.create().value;
    	cookie = newTracker;
    	res.cookie('PALTracker',newTracker,{maxAge:60*1000*60*24*365});
    }
    
    var data = {
    	key:cookie,
    	url:req.headers.referer,
    	host:req.headers.host
    }
  
    db.insert(data, function (err, newDoc) {   
    
    	console.log("stored", newDoc);
    	res.sendfile('./tracker.png');
	
	});


 });

   /* serves main page */
 app.get("/install", function(req, res) {
    res.sendfile('./install.js');
 });


 /* serves all the static files */
 app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
     res.sendfile( __dirname + req.params[0]); 
 });
 

 var port = process.env.PORT || 3333;
 var server = app.listen(port, function() {
   console.log("Listening on " + port);
 });