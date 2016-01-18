# dlt-node
Implementation of the AUTOSAR Diagnostic Log and Trace protocol in node.js.

## Dependencies
First, you will need the node.js framework and npm dependency management tool.

You can download node.js from: https://nodejs.org/

After this, go to your dlt-node directory. We need to install a few dependencies.
```
npm install express
npm install websocket
npm install bytebuffer
npm install binary
```
All done.
## Usage
```
node dlt-node --dlt-host <host> --dlt-port <port> --port <port>
```
**dlt-host:** The ip address or hostname where dlt-daemon is running. (default: localhost)

**dlt-port:** The port where the dlt-daemon is listening (default: 3490)

**port:** the port where we should listen for connections (default: 8080)

If everything goes smoothly, you should see the following:

>Connected to DLT daemon. localhost:3490

After this, point your web browser to: http://localhost:8080, or which ever port you chose while starting the system.

Provided that there is logging going on on the dlt-daemon, you should see a table with some basic information of each packet whizzing by.
To see the complete extracted data of each packet, you can go to http://localhost:8080/raw.html.

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