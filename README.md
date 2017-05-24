# dlt-node
Implementation of the AUTOSAR Diagnostic Log and Trace protocol in node.js.

## Usage
    const DltNode = require('dlt-node');
    const buffer = new DltNode.DltBuffer();
    buffer.on('packet', (packet) => {
    	// Do stuff with packet
    });

    buffer.buffer(DLT_STREAM_DATA_HERE);

See examples/client.js for example how to parse from dlt daemon.

## License
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

Copyright Lassi Marttala, Maxpower (C) 2016