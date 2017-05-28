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

const EventEmitter = require('events');
const util = require('util');
const ByteBuffer = require('bytebuffer');
const DltPacket = require(__dirname+'/protocol/dltpacket.js');

class DltBuffer extends EventEmitter {
	constructor() {
		super();
		this.buf = new ByteBuffer();
	}

	buffer(data) {
		this.buf.append(data);
		
		// Parse until all messages have been processed
		while(this.parseBuffer());
	};
	
	parseBuffer() {
		const bufLen = this.buf.offset;

		// Do we have at least minimum header in buffer?
		if(bufLen < 3) {
			return false;
		}
		// Get the complete packet size from header
		this.buf.offset = 2;
		const packetLen = this.buf.readInt16();
		
		// Not a complete packet in buffer
		if(packetLen > bufLen) {
			this.buf.offset = bufLen;
			return false;
		}
		// Copy the packet data from buffer
		const packetData = this.buf.copy(0, packetLen);

		// Let the packet object fill itself from data
		const packet = new DltPacket(packetData);
		
		// Signal that we have a new packet
		this.emit('packet', packet);

		// Discard the used data
		if(packetLen < bufLen) {
			this.buf = this.buf.copy(packetLen, bufLen);
			this.buf.offset = bufLen - packetLen;
		}
		else {		
			this.buf.offset = 0;
		}
		return true;
	}
}

module.exports = DltBuffer;