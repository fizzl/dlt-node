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

const DltStandardHeader = require('./dltstandardheader.js');
const DltExtendedHeader = require('./dltextendedheader.js');
const DltPayload = require('./dltpayload.js');

class DltPacket {
	constructor(buffer) {
        this.isParsed = false;
        this.data = buffer;
        this.length = buffer.limit;
        this.values = {
            StandardHeader: {},
            ExtendedHeader: {}
        };

        // Check actual header size:
        this.data.offset = 0;
        const flags = this.data.readInt8();
        let headerSize = 4;

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
        const headerPacket = this.data.copy(0, headerSize);
        this.values.StandardHeader = (new DltStandardHeader(headerPacket)).values;

        // Extract extended header, if it exists
        if(this.values.StandardHeader.UseExtendedHeader) {
            const extHeaderPacket = this.data.copy(headerSize, headerSize + DltExtendedHeader.ExtendedHeaderSize);
            this.values.ExtendedHeader = (new DltExtendedHeader(extHeaderPacket)).values;
        }

        // Extract payload if available
        const start = headerSize + DltExtendedHeader.ExtendedHeaderSize;
        const end = this.length;
        if(start !== end) {
            const payloadPacket = this.data.copy(start, end);
            this.values.Payload = (new DltPayload(payloadPacket, this)).values;
        }

        this.toJSON = function(replacer, space) {
            return JSON.stringify(this.values, replacer, space);
        }
	}
}

module.exports = DltPacket;