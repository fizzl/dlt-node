# dlt-node 0.3.0
Implementation of the AUTOSAR Diagnostic Log and Trace protocol in Node.js.

## Version history
*0.3.0** Librarify
* Port to EcmaScript 6
* Minimize dependencies
* Remove all actual client and database code
* Add example

*0.2.0** Initial release
* Possibility to push packets into MongoDB
* Possibility to query said database using JSON POST queries

**0.1.0** Initial release
* Socket connection to a dlt-daemon
* Protocol extraction
* Express based web server to serve UI files
* Websockets to serve decoded dlt packets

