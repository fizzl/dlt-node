# dlt-node
Implementation of the AUTOSAR Diagnostic Log and Trace protocol in node.js.

## Dependencies
First, you will need the node.js framework and npm dependency management tool.

You can download node.js from: https://nodejs.org/

This release has been tested with Node.js v4.2.4

MongoDB module installation will also require python. Tested to work with Python 2.7.11.

After this, go to your dlt-node directory. We need to install a few dependencies.
```
npm install express
npm install websocket
npm install bytebuffer
npm install binary
npm install body-parser
npm install mongodb
```
All done.
## Usage
```
node dlt-node --dlt-host <host> --dlt-port <port> --port <port> --websocket --database --database-connection-string <string>
```
**dlt-host:** The ip address or hostname where dlt-daemon is running. (default: localhost)

**dlt-port:** The port where the dlt-daemon is listening (default: 3490)

**port:** the port where we should listen for connections (default: 8080)

**websocket:** Enable websocket server for live streaming of packets (default: off)

**database:** Enable pushing packets into MongoDB. Also enables querying the database.

**database-connection-string:** The string used by MongoClient.connect(). (default: "mongodb://localhost:27017/dltdb")

If everything goes smoothly, you should see the following:

>Connected to DLT daemon. localhost:3490

After this, point your web browser to: http://localhost:8080, or which ever port you chose while starting the system.

Provided that there is logging going on on the dlt-daemon, you should see a table with some basic information of each packet whizzing by.
To see the complete extracted data of each packet, you can go to http://localhost:8080/raw.html.

As of version 0.2.0, there is also a database storing and retrieval possibility, but there is no demo UI for it yet.

## What else can I do with it?
Have a look at public/index.html. It has a very basic  decoding and formatting script. Did you check out http://localhost:8080/raw.html yet? That's the rest of the data. You can do whatever you please with it :)

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