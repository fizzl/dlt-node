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
const binary = require('binary');

class DltPayloadArgument {
	constructor(buffer) {
	    const self = this;
        this.data = buffer;
        this.data.offset=0;
        this.length = 4;
        this.parser = binary.parse(this.data.buffer);
        this.parser
            .word32lu('TypeInfo')
            .tap(function(vars) {
                vars.TypeLength = vars.TypeInfo & module.exports.FLAG_TypeLengthMask;

                // If String, check if multibyte
                if(vars.TypeInfo & module.exports.FLAG_TypeString) {
                    self.parser.word16lu('DataLength');
                    self.length += 2;
                    this.buffer('Data', vars.DataLength);
                    self.length += vars.DataLength;
                    if(vars.TypeInfo & module.exports.FLAG_TypeStringEncodingUtf8) {
                        vars.Data = vars.Data.toString('utf8');
                    }
                    else {
                        vars.Data = vars.Data.toString('ascii');
                    }
                }

                // Get raw types
                else if(vars.TypeInfo & module.exports.FLAG_TypeRaw ||
                    vars.TypeInfo & module.exports.FLAG_TypeTraceInfo) {
                    this.word16lu('DataLength');
                    self.length += 2;
                    this.buffer('Data', vars.DataLength);
                    self.length += vars.DataLength;
                }


                // Get variable type
                else if(vars.TypeInfo & module.exports.FLAG_TypeVariable) {
                    /** Use the same names for storing the length temporarily,
                     * to prevent contaminating the namespace of values */
                    this.word16lu('Name');
                    this.word16lu('Unit');
                    self.length += 4 + vars.Name + vars.Unit;
                    this.buffer('Name', vars.Name);
                    vars.Name = vars.Name.toString('ascii');
                    this.buffer('Unit', vars.Unit);
                    vars.Unit = vars.Unit.toString('ascii');
                }

                // Boolean special case
                else if(vars.TypeInfo & module.exports.FLAG_TypeBoolean) {
                    this.word8('Data');
                    self.length++;
                    if(vars.Data !== 0) {
                        vars.Data = true;
                    }
                    else {
                        vars.Data = false;
                    }
                }

                else if(vars.TypeInfo & module.exports.FLAG_TypeUnsignedInteger ||
                    vars.TypeInfo & module.exports.FLAG_TypeSignedInteger ||
                    vars.TypeInfo & module.exports.FLAG_TypeFloat) {
                    let byteCount = 0;
                    switch(vars.TypeLength) {
                        case 1:
                            byteCount = 1;
                            break;
                        case 2:
                            byteCount = 2;
                            break;
                        case 3:
                            byteCount = 4;
                            break;
                        case 4:
                            byteCount = 8;
                            break;
                        case 5:
                            byteCount = 16;
                            break;
                    }
                    this.buffer('Data', byteCount);
                    self.length += byteCount;

                    if(vars.TypeInfo & module.exports.FLAG_TypeUnsignedInteger) {
                        vars.Data = vars.Data.readUIntLE(0, byteCount);
                    }
                    if(vars.TypeInfo & module.exports.FLAG_TypeSignedInteger) {
                        vars.Data = vars.Data.readIntLE(0, byteCount);
                    }
                    if(vars.TypeInfo & module.exports.FLAG_TypeFloat) {
                        if(byteCount === 4) {
                            vars.Data = vars.Data.readFloatLE();
                        }
                        else if(byteCount === 8) {
                            vars.Data = vars.Data.readDoubleLE();
                        }
                        // else, don't try to parse
                    }


                }
            });

        this.values = this.parser.vars;
	}
}

module.exports = DltPayloadArgument;

module.exports.FLAG_TypeLengthMask			= 0b00000000000000000000000000001111;
module.exports.FLAG_TypeBoolean				= 0b00000000000000000000000000010000;
module.exports.FLAG_TypeSignedInteger		= 0b00000000000000000000000000100000;
module.exports.FLAG_TypeUnsignedInteger		= 0b00000000000000000000000001000000;
module.exports.FLAG_TypeFloat				= 0b00000000000000000000000010000000;
module.exports.FLAG_TypeArray				= 0b00000000000000000000000100000000;
module.exports.FLAG_TypeString				= 0b00000000000000000000001000000000;
module.exports.FLAG_TypeRaw					= 0b00000000000000000000010000000000;
module.exports.FLAG_TypeVariable			= 0b00000000000000000000100000000000;
module.exports.FLAG_TypeFixedPoint			= 0b00000000000000000001000000000000;
module.exports.FLAG_TypeTraceInfo			= 0b00000000000000000010000000000000;
module.exports.FLAG_TypeStruct				= 0b00000000000000000100000000000000;
module.exports.FLAG_TypeStringEncodingUtf8	= 0b00000000000000001000000000000000;


