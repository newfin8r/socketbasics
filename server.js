var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app); //creates a new serrver using the express app we crerated above as a boiler plate meaing whatever app listens to http does as well
var io = require('socket.io')(http); //you pass it the http server variable. sockect.io expects this. The io variable is used like the app variable
var moment = require('moment');

var clientInfo = {}; //meant as a means(model for) of storing user session data

//sned current usrs to provided socket
function sendCurrentUsers(socket) {
    var info = clientInfo[socket.id];
    var users = [];

    if (typeof(info) === 'undefined') {
        return;
    }

    Object.keys(clientInfo).forEach(function(socketId) { //Object.keys returns an array og object properties/attributes
        var userinfo = clientInfo[socketId];
        if (info.room === userinfo.room) {
            users.push(userinfo.name);
        }
    });

    socket.emit('message', {
        name: 'System',
        text: 'Current users: ' + users.join(', '),
        timestamp: moment().valueOf()
    });
}
// function sendPrivateMessage(socket, toUser, message) {
//     var info = clientInfo[socket.id];
//
//     if (typeof(info) === 'undefined') {
//         return;
//     }
//
//     Object.keys(clientInfo).forEach(function(socketId) { //Object.keys returns an array og object properties/attributes
//         var userinfo = clientInfo[socketId];
//         if (userinfo.name === toUser) {
//             socket.emit('message', {
//                 name: 'System',
//                 text: 'Current users: ' + users.join(', '),
//                 timestamp: moment().valueOf()
//             });
//         }
//     });
// }

io.on('connection', function(socket) { //on lets you liste to events. The first param is the name of the event and the second is the function to fire during that event. You get access to the individual socket connection
    console.log('user connected via socket.io'); //writes when a user connects

    socket.on('joinRoom', function(req) { //the req object is the ome defined in app.js in the matching call
        clientInfo[socket.id] = req; //use square braces instead of direct attribute assignment when the attributes are dynamic instead of known
        socket.join(req.room); //join is a built in socket method
        socket.broadcast.to(req.room).emit('message', { //to() allows you to specify a room to send to
            name: 'System',
            text: req.name + ' has joined!',
            timestamp: moment().valueOf() //add a timestamp property to the message
        });
    });

    socket.on('message', function(message) { //listens to a message event
        console.log('Message :' + message.timestamp + message.text);
        if (message.text === '@currentUsers') {
            sendCurrentUsers(socket);
        }
        // else if (message.text.indexOf('@private')!=-1) {
        //     var toUser;
        //     var privateMessage;
        //
        //     sendPrivateMessage(socket, toUser, privateMessage);
        // }
        else {
            message.timestamp = moment().valueOf(); //add a timestamp property to the message and set  it as the value of so that it is a number
            //socket.broadcast.emit('message', message); //broadcast.emit send data to every socket except the one that originally sent it instead of every socket INCLUDING the originator
            //io.emit('message', message); //sends the message to all connected users
            io.to(clientInfo[socket.id].room).emit('message',
                message); //changed from above to target user room
        }

    });

    socket.emit('message', { //access to the socket and pass data back. The first param is the event name, the second is the data being passed back. Using an object as the data allows you to store more.
        name: 'system',
        timestamp: moment().valueOf(), //add a timestamp property to the message and set  it as the value of so that it is a number,
        text: "Welcome to the app"
    });

    socket.on('disconnect', function() { //disconnect is a built in event
        var userData = clientInfo[socket.id];
        if (typeof(userData) != 'undefined') { //see if user did something
            socket.leave(userData.room); //disconnects from room
            io.to(userData.room).emit('message', {
                name: 'System',
                text: userData.name +
                    ' has left the room',
                timestamp: moment().valueOf()
            });
            delete clientInfo[socket.id]; //delete lets us delete an atribute from an object
        }
    });
});

app.use(express.static(__dirname + '/public'));

http.listen(PORT, function() {
    console.log('server started');
});
