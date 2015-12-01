var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

//Sends current users to provided socket
function sendCurrentUsers(socket) {
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined') {
		return;
	}

	Object.keys(clientInfo).forEach(function(socketId) { //pulls all keys in the clientInfo object
		var userInfo = clientInfo[socket.id];
		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});
	
	socket.emit('message', {
		name: 'System',
		text: 'Current Users: ' + users.join(', '),
		timestamp: moment().valueOf()
	});
}

io.on('connection', function(socket) {
	console.log('User connected via socket.io!');

	socket.on('disconnect', function() {
		var userData = clientInfo[socket.id];
		if (typeof userData !== 'undefined') { //checks if there is any client info
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left!',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', { //joins the user to the requested room and emits a message to that room that the user has joined
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment().valueOf()
		});
	});

	socket.on('message', function(message) { //called when server receives a new message
		console.log('Message received from ' + message.name + ': ' + message.text);

		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else {
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message); //sends message to everyone including sender in specified room only
			//socket.broadcast.emit('message', message);	//sends message to everyone except sender
		}
	});

	socket.emit('message', { //called on connection to socket
		name: 'System',
		text: 'Welcome to the chat application!',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT, function() {
	console.log('Server Started!');
});