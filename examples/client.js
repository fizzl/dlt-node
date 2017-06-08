/**
  * This file is part of dlt-node.
  *
  * dlt-node is free software: you can redistribute it and/or modify
  * it under the terms of the GNU General Public License as published by
  * the Free Software Foundation, either version 3 of the License, or
  * (at your option) any later version.
  * 
  * dlt-node is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  * GNU General Public License for more details.
  * 
  * You should have received a copy of the GNU General Public License
  * along with dlt-node.  If not, see <http://www.gnu.org/licenses/>.
  * 
  * Copyright Lassi Marttala, Maxpower (C) 2016
  */

// Standard node libraries
const Net = require('net');
const fs = require('fs');
const Dlt = require(__dirname+'/../');

// Parser buffer which wraps the protocol and parses packets
const buffer = new Dlt.DltBuffer();

// Connect to Dlt Daemon via TCP. Edit the port and host here if you need to
const client = new Net.connect(3490, 'localhost',
() => {
	console.log('Connected to DLT daemon.');
});

// When Dlt Daemon sends data via TCP, add it to parser buffer
client.on('data', (data) => {
	buffer.buffer(data);
});

// When parser buffer finds a packet, print it to console
buffer.on('packet', (packet) => {
	console.log(Date.now(), ':', packet.toJSON(null, 2));
});

// When Dlt Daemon connection reports and error, print it to stderr
client.on('error', (error) => {
	console.error(error);
});

// When Dlt Daemon connection has been closed, exit client
client.on('close', () => {
	console.log('DLT Client Socket closed');
	process.exit();
});
