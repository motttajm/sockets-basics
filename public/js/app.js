var socket = io();

socket.on('connect', function () {
	console.log('Connected to socket.io server!');
});

socket.on('message', function (message) {
	console.log('New message:');
	console.log(message.text);

	jQuery('.messages').append('<p>' + message.text +'</p>');	//. denotes targeting the tag by class
});

// Handles submitting of new message
var $form = jQuery('#message-form');	//# denotes you are calling the tag by the id

$form.on('submit', function (event) {
	event.preventDefault();	//prevents a refresh on the entire page when form submission takes place

	var $message = $form.find('input[name=message]')
	socket.emit('message', {
		text: $message.val()
	});

	$message.val('');	//erase the contents of the input after emitting the message

});