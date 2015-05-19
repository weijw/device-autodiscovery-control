var SSDP = require('node-ssdp').Server
var http = require('http')
var qs = require('querystring');

var opts = {
  port: 3000,
  path: '/ssdp/service-list.json',
  method: 'GET'  
}

exports.autodicovery = function(app){

  var server = new SSDP({
    logLevel: 'TRACE',
        //unicastHost: '109.123.100.11',
        location: "/ssdp/device-imformation"
      })

  server.addUSN('upnp:rootdevice')
    //server.addUSN('urn:schemas-upnp-org:device:MediaServer:1')
    server.addUSN('urn:schemas-upnp-org:service:test9526:1')
    //server.addUSN('urn:schemas-upnp-org:service:ConnectionManager:1')
    
    server.on('advertise-alive', function (heads) {
  //console.log('advertise-alive', heads)
  // Expire old devices from your cache.
  // Register advertising device somewhere (as designated in http headers heads)
})
    
    server.on('advertise-bye', function (heads) {
        //console.log('advertise-bye', heads)
  // Remove specified device from cache.
})
    
    // start server on all interfaces
    server.start('0.0.0.0')

    app.post("/ssdp/device-imformation",parserDeviceInformation)
  }

  var parserDeviceInformation = function (req, res){ 
    var deviceinformation = req.body;
    opts.host = deviceinformation.ip;
  //console.log(deviceinformation.ip);
  console.log(deviceinformation);

  //getServiceList(opts);
}  


exports.getServiceList = function(opts){
  console.log("---------------------" + qs.stringify(opts));
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

  req.end();  
}
