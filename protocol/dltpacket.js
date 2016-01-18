const util = require('util');
var DltStandardHeader = require('./dltstandardheader.js');
var DltExtendedHeader = require('./dltextendedheader.js');
var DltPayload = require('./dltpayload.js');
var DltPacket = function(buffer) {
	this.isParsed = false;
	this.data = buffer;
	this.length = buffer.limit;
	this.values = {
		StandardHeader: {},
		ExtendedHeader: {}		
	};
	// Check actual header size:
	this.data.offset = 0;
	var flags = this.data.readInt8();
	var headerSize = 4;

	if(flags & DltStandardHeader.FLAG_WithEcuId) {
		headerSize += 4;
	}
	if(flags & DltStandardHeader.FLAG_WithSessionId) {
		headerSize += 4;
	}
	if(flags & DltStandardHeader.FLAG_WithTimestamp) {
		headerSize += 4;
	}
	// Extract standard header from buffer
	var headerPacket = this.data.copy(0, headerSize);
	this.values.StandardHeader = (new DltStandardHeader(headerPacket)).values;
	
	// Extract extended header, if it exists
	if(this.values.StandardHeader.UseExtendedHeader) {
		var extHeaderPacket = this.data.copy(headerSize, headerSize + DltExtendedHeader.ExtendedHeaderSize);
		this.values.ExtendedHeader = (new DltExtendedHeader(extHeaderPacket)).values;
	}
	
	// Extract payload if available
	var start = headerSize + DltExtendedHeader.ExtendedHeaderSize;
	var end = this.length;
	if(start != end) {
		var payloadPacket = this.data.copy(start, end);
		this.values.Payload = (new DltPayload(payloadPacket, this)).values;
	}
	
	this.toJSON = function(replacer, space) {
		return JSON.stringify(this.values, replacer, space);
	}
}

module.exports = DltPacket;