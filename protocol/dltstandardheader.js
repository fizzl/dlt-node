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

var DltStandardHeader = function(buffer) {
	var self = this;

	this.data = buffer;
	this.data.offset=0;

	this.values = binary.parse(this.data.buffer)
	.word8('HeaderType')
	.tap(function(vars) {
		vars.UseExtendedHeader = false;
		vars.IsBigEndian = false;
		vars.WithEcuId = false;
		vars.WithSessionId = false;
		vars.WithTimestamp = false;
		if(vars.HeaderType & module.exports.FLAG_UseExtendedHeader) {
			vars.UseExtendedHeader = true;
		}
		if(vars.HeaderType & module.exports.FLAG_IsBigEndian) {
			vars.IsBigEndian = true;
		}
		if(vars.HeaderType & module.exports.FLAG_WithEcuId) {
			vars.WithEcuId = true;
		}
		if(vars.HeaderType & module.exports.FLAG_WithSessionId) {
			vars.WithSessionId = true;
		}
		if(vars.HeaderType & module.exports.FLAG_WithTimestamp) {
			vars.WithTimestamp = true;
		}
		vars.ProtocolVersion = (vars.HeaderType & module.exports.FLAG_VersionNumberMask) >> 5;
	})
	.word8('MessageCounter')
	.word16bu('Length')
	.tap(function(vars) {
		if(vars.WithEcuId) {
			this.buffer('EcuId', 4);
			vars.EcuId = vars.EcuId.toString('ascii');
		}
		if(vars.WithSessionId) {
			this.word32bu('SessionId');
		}
		if(vars.WithTimestamp) {
			this.word32bu('Timestamp');
		}
	})
	.vars;
}

module.exports = DltStandardHeader;
module.exports.FLAG_UseExtendedHeader	= 0b00000001;
module.exports.FLAG_IsBigEndian 		= 0b00000010;
module.exports.FLAG_WithEcuId		 	= 0b00000100;
module.exports.FLAG_WithSessionId	 	= 0b00001000;
module.exports.FLAG_WithTimestamp	 	= 0b00010000;
module.exports.FLAG_VersionNumberMask	= 0b11100000;