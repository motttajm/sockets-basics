var nameParameter = getQueryVariable('name') || 'Anonymous';
var roomParameter = getQueryVariable('room');
var socket = io();

console.log(nameParameter + ' joined ' + roomParameter);

jQuery('.room-title').text('Chat Room: ' + roomParameter);	//update chat room title

socket.on('connect', function () { //this is called when the client connects to the server
	console.log('Connected to socket.io server!');	
	socket.emit('joinRoom', {		//emit custom event to the server to tell the server which room the user wants to join
		name: nameParameter,
		room: roomParameter
	});
});

socket.on('message', function (message) { //this is called when a new incoming message is received
	var momentTimestamp = moment.utc(message.timestamp);
	var $message = jQuery('.messages');
	
	console.log('Received new message from ' + message.name);
	console.log(message.text);

	$message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm:ss a') + '</strong></p>');
	$message.append('<p>' + message.text + '</p>');
	});

// Handles submitting of new message
var $form = jQuery('#message-form');	//# denotes you are calling the tag by the id

$form.on('submit', function (event) { //this is called when a message is submitted through the UI
	console.log('Sending message');
	event.preventDefault();	//prevents a refresh on the entire page when form submission takes place

	var $message = $form.find('input[name=message]')

	socket.emit('message', {
		name: nameParameter,
		text: $message.val()
	});

	$message.val('');	//erase the contents of the input after emitting the message

});