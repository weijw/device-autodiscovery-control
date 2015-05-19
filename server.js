var express = require('express');
var bodyParser = require('body-parser');
var uuid = require('node-uuid');
var	myUuid = uuid.v4();
var	fs = require('fs');
var name = "device A";
var autodiscovery = require('./auto-discovery');

var app = express.createServer();

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get("/ssdp/iot-desc.xml", function(req, res) {
		fs.readFile('./deviceinformation.json', 'utf8', function (err,data) {
			//data = data.replace("#uuid#", myUuid).replace("#base#","http://"+req.headers.host).replace("#name#", name);
			//res.type('xml');
			res.setHeader("Access-Control-Allow-Method", "GET, POST, DELETE, OPTIONS");
			res.setHeader("Access-Control-Expose-Headers", "Location");
			res.setHeader("Application-Url", "http://"+req.headers.host+"/apps");
			res.send(data);
			console.log("res.send(data): " + data);
		});
	});

app.listen(3000);

autodiscovery.autodicovery(app);
	
