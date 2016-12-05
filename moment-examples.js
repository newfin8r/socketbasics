var moment = require('moment');
var now = moment();

console.log(now.format());
console.log(now.format('YYYY MMMM DD, hA'));
console.log(now.format('h:mm A'));
now.subtract(1, 'year'); //the first parameter is the amount and the second is the unit
console.log(now.format('MMM Do YYYY, hA'));

console.log(now.format('X')); //the X returns a UNIX timestamp format in seconds
console.log(now.format('x')); //the x returns a UNIX timestamp format in miliseconds
console.log(now.valueOf()); //returns a number instead of a string

var timestamp = 1444247486704;
var timestampMoment = moment.utc(timestamp); //creates a timestamp from a number
timestampMoment.local(); //sets the time to the current timezone offset
console.log(timestampMoment.format('h:mm a'));
