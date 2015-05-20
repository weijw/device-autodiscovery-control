var http = require('http')
var bodyParser = require('body-parser');
var express = require('express')
var fs = require('fs')
var qs = require('querystring');

var ssdp = require('node-ssdp').Client
  , client = new ssdp({
    logLevel: 'TRACE',
    unicastHost: require('ip').address()
  })

client.on('notify', function () {
  //console.log('Got a notification.')
})


client.on('response', function inResponse(headers, code, rinfo) {
	if(headers.ST.indexOf("urn:schemas-upnp-org:service:test9526:1") != -1)
	{
    console.log('Got a response to an m-search:\n%d\n%s\n%s', code, JSON.stringify(headers, null, '  '), JSON.stringify(rinfo, null, '  '))

    url =  headers.LOCATION
    var ip = rinfo.address
        console.log(url);

    var opts = {
      port: 3000,
      method: 'post',
      headers: {'content-type':'application/x-www-form-urlencoded'}
    }
    opts.host = ip
    opts.path = url

    console.log(opts);
    request_Iotinfo(opts)
   
  }
})


client.search('urn:schemas-upnp-org:service:test9526:1')

// Or maybe if you want to scour for everything
setInterval(function() {
  client.search('ssdp:all')
}, 10000)

var post_deviceinformation = new Object;

post_deviceinformation.device_type = "service device";
post_deviceinformation.device_id = "1234567890";
post_deviceinformation.device_name = "device A";
post_deviceinformation.service_name = "test";
post_deviceinformation.version = "1.0.1"

function getIPAddress() {
  var n = require('os').networkInterfaces();
  var ip = []
  for (var k in n) {
    var inter = n[k];
    for (var j in inter) {
      if (inter[j].family === 'IPv4' && !inter[j].internal) {
        return inter[j].address
      }
    }
  }
}

post_deviceinformation.ip = getIPAddress();

var content = qs.stringify(post_deviceinformation);

var request_Iotinfo = function(opts){

  var req = http.request(opts, function (res) {  
    console.log('STATUS: ' + res.statusCode);  
    console.log('HEADERS: ' + JSON.stringify(res.headers));  
    res.setEncoding('utf8');  

    res.on('data', function (chunk) {  
      console.log('BODY: ' + chunk);  
    });  
  }); 

  req.on('error', function (e) {  
    console.log('problem with request: ' + e.message);  
  });  
  
// write data to request body  
req.write(content);  

req.end();
}

var app = express.createServer();

app.use(bodyParser.json({limit:'1mb'}));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/ssdp/service-list",function(req, res){
      console.log("======================================================");
      fs.readFile('./deviceinformation', 'utf8', function (err,data) {
      //res.type('json');
      res.setHeader("Access-Control-Allow-Method", "GET, POST, DELETE, OPTIONS");
      res.setHeader("Access-Control-Expose-Headers", "Location");
      res.setHeader("Application-Url", "http://"+req.headers.host+"/apps");
      res.send(data);
      console.log("res.send(data): " + data);
    });
})

app.listen(3000);