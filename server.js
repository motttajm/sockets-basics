var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
	console.log('User connected via socket.io!');

	socket.on('message', function (message) {
		message.timestamp = moment().valueOf();
		console.log('Message received: ' + message.text);
		
		io.emit('message', {
			timestamp: message.timestamp,
			text: message.text
		});	//sends message to everyone including sender

		//socket.broadcast.emit('message', message);	//sends message to everyone except sender
	});

	socket.emit('message', {
		timestamp: moment().valueOf(),
		text: 'Welcome to the chat application!'
	});
});

http.listen(PORT, function () {
	console.log('Server Started!');
});
