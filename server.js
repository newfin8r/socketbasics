var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app); //creates a new serrver using the express app we crerated above as a boiler plate meaing whatever app listens to http does as well

app.use(express.static(__dirname + '/public'));

http.listen(PORT, function() {
    console.log('server started');
});
