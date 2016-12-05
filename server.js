var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app); //creates a new serrver using the express app we crerated above as a boiler plate meaing whatever app listens to http does as well
var io = require('socket.io')(http); //you pass it the http server variable. sockect.io expects this. The io variable is used like the app variable
var moment = require('moment');

io.on('connection', function(socket) { //on lets you liste to events. The first param is the name of the event and the second is the function to fire during that event. You get access to the individual socket connection
    console.log('user connected via socket.io'); //writes when a user connects

    socket.on('message', function(message) { //listens to a message event
        message.timestamp = moment().valueOf(); //add a timestamp property to the message and set  it as the value of so that it is a number
        console.log('Message :' + message.timestamp + message.text);
        //socket.broadcast.emit('message', message); //broadcast.emit send data to every socket except the one that originally sent it instead of every socket INCLUDING the originator
        io.emit('message', message); //sends the message to all connected users
    });

    socket.emit('message', { //access to the socket and pass data back. The first param is the event name, the second is the data being passed back. Using an object as the data allows you to store more.
        timestamp: moment().valueOf(), //add a timestamp property to the message and set  it as the value of so that it is a number,
        text: "Welcome to the app"
    });
});

app.use(express.static(__dirname + '/public'));

http.listen(PORT, function() {
    console.log('server started');
});
4
