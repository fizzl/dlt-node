const util = require('util');
var binary = require('binary');
var DltStandardHeader = require('./dltstandardheader.js');
var DltExtendedHeader = require('./dltextendedheader.js');
var DltPayloadArgument = require('./dltpayloadargument.js');

var DltPayload = function(buffer, packet) {
	self = this;
	this.data = buffer;
	this.data.offset=0;
	
	var parser = binary.parse(this.data.buffer);
	// Parse non-verbose message id
	if(packet.values.StandardHeader.UseExtendedHeader &&
	   !packet.values.ExtendedHeader.Verbose) {
		   parser.word32lu('MessageId');
		   this.data.offset += 4;
	}

	// Parse control message
	if(packet.values.StandardHeader.UseExtendedHeader &&
	   !packet.values.ExtendedHeader.Verbose &&
	   packet.values.ExtendedHeader.MessageType == DltExtendedHeader.DLT_TYPE_CONTROL) {
		parser.vars.ControlServiceId = parser.vars.MessageId;
		if(packet.values.ExtendedHeader.MessageTypeInfo == 
			DltExtendedHeader.DLT_CONTROL_RESPONSE) {
			parser.word8('ControlReturnType');
			this.data.offset += 1;
		}
	}
	this.values = parser.vars;
	this.values.Arguments = [];
	
	if(packet.values.StandardHeader.UseExtendedHeader &&
		packet.values.ExtendedHeader.Verbose) {
		while(this.data.offset < this.data.limit) {
			newPayload = new DltPayloadArgument(this.data.copy());
			this.data.offset += newPayload.length;
			this.values.Arguments.push(newPayload.values);
		}
	}
	
	buffer.offset = 0;
	this.values.Data = buffer.buffer;

}

module.exports = DltPayload;
