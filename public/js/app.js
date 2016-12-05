var socket = io(); //requires the socket.io file be loaded in the main HTML file first and creates a socket object and connects to the internal server
socket.on('connect', function() {
    console.log('Client connected to socket.io server');
});
var name = getQueryParam('name') || 'Anonymous';
var room = getQueryParam('room');
console.log('name: ' + name + ' room: ' + room);

socket.on('message', function(message) { //creates a listener for a custom event called in server.js
    var momentTimeStamp = moment.utc(message.timestamp);
    var $message = jQuery('.messages');

    $message.append('<p><strong>' + message.name + ' ' +
        momentTimeStamp.local().format('h:mm a') + '</strong></p>');
    $message.append('<p>' + message.text + '</p>');

    console.log('message recieved:' + $message.html());
});
socket.emit('message2', { //access to the socket and pass data back. The first param is the event name, the second is the data being passed back. Using an object as the data allows you to store more.
    text: "This is from the client"
});
//Handle message submit:
var $form = jQuery('#message-form');
$form.on('submit', function(event) {
    event.preventDefault(); //keeps the form from submitting the old fashion ed way of refreshing the whole page
    var $message = $form.find('input[name=message]'); //in jQuery using [] is way of specifying attributes on a object for searching
    socket.emit('message', {
        name: name,
        timestamp: moment(),
        text: $message.val()
    });
    $message.val(''); //clear the input
});
