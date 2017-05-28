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
const DltExtendedHeader = require('./dltextendedheader.js');
const DltPayloadArgument = require('./dltpayloadargument.js');

class DltPayload {
	constructor(buffer, packet) {
        this.data = buffer;
        this.data.offset=0;
        const parser = binary.parse(this.data.buffer);

        // Parse non-verbose message id
        if(packet.values.StandardHeader.UseExtendedHeader &&
            !packet.values.ExtendedHeader.Verbose) {
            parser.word32lu('MessageId');
            this.data.offset += 4;
        }

        // Parse control message
        if(packet.values.StandardHeader.UseExtendedHeader &&
            !packet.values.ExtendedHeader.Verbose &&
            packet.values.ExtendedHeader.MessageType === DltExtendedHeader.DLT_TYPE_CONTROL) {
            parser.vars.ControlServiceId = parser.vars.MessageId;
            if(packet.values.ExtendedHeader.MessageTypeInfo === DltExtendedHeader.DLT_CONTROL_RESPONSE) {
                parser.word8('ControlReturnType');
                this.data.offset += 1;
            }
        }
        this.values = parser.vars;
        this.values.Arguments = [];

        if(packet.values.StandardHeader.UseExtendedHeader &&
            packet.values.ExtendedHeader.Verbose) {
            while(this.data.offset < this.data.limit) {
                const newPayload = new DltPayloadArgument(this.data.copy());
                this.data.offset += newPayload.length;
                this.values.Arguments.push(newPayload.values);
            }
        }

        buffer.offset = 0;
        this.values.Data = buffer.buffer;
	}
}

module.exports = DltPayload;
