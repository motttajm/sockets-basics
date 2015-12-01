var moment = require('moment');
var now = moment();

// console.log(now.format());
// console.log(now.format('X'));	//seconds since UNIX epoch
// console.log(now.format('x'));	//milliseconds since current UNIX epoch
// console.log(now.valueOf());		//same as above but outputs a number instead of a string

var timestampMoment = moment.utc(now.valueOf());
console.log(timestampMoment.local().format('MMMM Do YYYY, h:mm a'));

// console.log(now.format('dddd, MMMM Do YYYY, h:mm:ss a'));