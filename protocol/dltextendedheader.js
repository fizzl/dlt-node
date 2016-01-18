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

const util = require('util');
var binary = require('binary');

var DltExtendedHeader = function(buffer) {
	self = this;

	this.data = buffer;
	this.data.offset=0;

	this.values = binary.parse(this.data.buffer)
	.word8('MessageInfo')
	.tap(function(vars) {
		vars.Verbose = vars.MessageInfo & module.exports.FLAG_Verbose;
		vars.MessageType = (vars.MessageInfo & module.exports.FLAG_MessageTypeMask) >> 1;
		vars.MessageTypeInfo = (vars.MessageInfo & module.exports.FLAG_MessageTypeInfoMask) >> 4;
	})
	.word8('NumberOfArguments')
	.buffer('AppId', 4)
	.tap(function(vars) {
		vars.AppId = vars.AppId.toString('ascii');
	})
	.buffer('ContextId', 4)
	.tap(function(vars) {
		vars.ContextId = vars.ContextId.toString('ascii');
	})
	.vars;
}

module.exports = DltExtendedHeader;
module.exports.ExtendedHeaderSize = 10;

// Masks for parsing parameters
module.exports.FLAG_Verbose				= 0b00000001;
module.exports.FLAG_MessageTypeMask		= 0b00001110;
module.exports.FLAG_MessageTypeInfoMask	= 0b11110000;

// Message type values
module.exports.DLT_TYPE_LOG				=	0x00;
module.exports.DLT_TYPE_APP_TRACE		=	0x01;
module.exports.DLT_TYPE_NW_TRACE		=	0x02;
module.exports.DLT_TYPE_CONTROL			=	0x03;

// Message log info values
module.exports.DLT_LOG_FATAL			= 0x01;
module.exports.DLT_LOG_ERROR			= 0x02;
module.exports.DLT_LOG_WARN				= 0x03;
module.exports.DLT_LOG_INFO				= 0x04;
module.exports.DLT_LOG_DEBUG			= 0x05;
module.exports.DLT_LOG_VERBOSE			= 0x06;

// Message trace info values
module.exports.DLT_TRACE_VARIABLE		= 0x01;
module.exports.DLT_TRACE_FUNCTION_IN	= 0x02;
module.exports.DLT_TRACE_FUNCTION_OUT	= 0x03;
module.exports.DLT_TRACE_STATE			= 0x04;
module.exports.DLT_TRACE_VFB			= 0x05;

// Message BUS info values
module.exports.DLT_NW_TRACE_IPC			= 0x01;
module.exports.DLT_NW_TRACE_CAN			= 0x02;
module.exports.DLT_NW_TRACE_FLEXRAY		= 0x03;
module.exports.DLT_NW_TRACE_MOST		= 0x04;
// 0x05-0x07 = Reserved
// 0x08-0x15 = User defined

// Message control info
module.exports.DLT_CONTROL_REQUEST		= 0x01;
module.exports.DLT_CONTROL_RESPONSE		= 0x02;
module.exports.DLT_CONTROL_TIME			= 0x03;
