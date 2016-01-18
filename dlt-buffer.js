const EventEmitter = require('events');
const util = require('util');
var ByteBuffer = require('bytebuffer');
var DltPacket = require('./protocol/dltpacket.js');

var DltBuffer = function() {
	var self = this;
	var buffer = new ByteBuffer();
	
	this.buffer = function(data) {
		buffer.append(data);
		
		// Parse until all messages have been processed
		while(parseBuffer());
	};
	
	function parseBuffer() {
		var bufferLen = buffer.offset;

		// Do we have atleast minimum header in buffer?
		if(bufferLen < 3) {
			return false;
		}
		// Get the complete packet size from header
		buffer.offset = 2;
		var packetLen = buffer.readInt16();
		
		// Not a complete packet in buffer
		if(packetLen > bufferLen) {
			buffer.offset = bufferLen;
			return false;
		}
		// Copy the packet data from buffer
		var packetData = buffer.copy(0, packetLen);

		// Let the packet object fill itself from data
		var packet = new DltPacket(packetData);
		
		// Signal that we have a new packet
		self.emit('packet', packet);

		// Discard the used data
		if(packetLen < bufferLen) {
			buffer = buffer.copy(packetLen, bufferLen);
			buffer.offset = bufferLen - packetLen;
		}
		else {		
			buffer.offset = 0;
		}
		return true;
	}
}

util.inherits(DltBuffer, EventEmitter);

module.exports = DltBuffer;