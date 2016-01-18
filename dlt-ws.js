var Net = require('net');
var fs = require('fs');
var express = require('express');
var WebSocketServer = require('websocket').server;

var options = require('./options.js');
var DltBuffer = require('./dlt-buffer.js');

options.parseCommandLine();
var buffer = new DltBuffer();

var client = new Net.connect(options.DLT_PORT, options.DLT_HOST, 
() => {
	console.log(`Connected to DLT daemon. ${options.DLT_HOST}:${options.DLT_PORT}`);
});

client.on('data', (data) => {
	buffer.buffer(data);
});

buffer.on('packet', (packet) => {
	// console.log(packet.toJSON(null, 2));
	var liveConnections = [];
	for(i=0;i<connections.length;i++) {
		var con = connections[i];
		if(con.connected) {
			con.send(packet.toJSON(null, 2));
			liveConnections.push(con);
		}
	}
	connections = liveConnections;
});


client.on('error', (error) => {
	console.log(`Error: ${error.toString()}`);
});

client.on('close', () => {
	console.log('DLT Client Socket closed');
	process.exit();
});

// Express server
var app = express();
var server = app.listen(options.PORT);
app.use(express.static(__dirname+'/public'));

// Websocket server
wsServer = new WebSocketServer({
	httpServer: server,
	autoAcceptConnections: false
});

function originIsAllowed(origin) {
	return true;
}

var connections = [];
wsServer.on('request', function(request) {
	if(!originIsAllowed(request.origin)) {
		request.reject();
		console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
		return;
	}
	
	var connection = request.accept('dlt-json', request.origin);
	connections.push(connection);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
