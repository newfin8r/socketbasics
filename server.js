var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app); //creates a new serrver using the express app we crerated above as a boiler plate meaing whatever app listens to http does as well
var io = require('socket.io')(http); //you pass it the http server variable. sockect.io expects this. The io variable is used like the app variable

io.on('connection', function() { //on lets you liste to events. The first param is the name of the event and the second is the function to fire during that event
    console.log('user connected via socket.io'); //writes when a user connects
});

app.use(express.static(__dirname + '/public'));

http.listen(PORT, function() {
    console.log('server started');
});
