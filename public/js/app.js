var nameParameter = getQueryVariable('name') || 'Anonymous';
var roomParameter = getQueryVariable('room');
var socket = io();

console.log(nameParameter + ' joined ' + roomParameter);

socket.on('connect', function () { //this is called when the socket is connected to
	console.log('Connected to socket.io server!');	
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