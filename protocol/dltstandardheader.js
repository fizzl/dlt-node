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