const util = require('util');
var dbClient = require('mongodb').MongoClient;
var options = require('../options.js');


var DltDatabase = function() {
	options.parseCommandLine();
	
	var packets = null;
	
	this.connect = function() {
		dbClient.connect(options.DB_CONNECTION_STRING, function(err, db) {
			if(err) {
				console.dir(err);
				process.exit(1);
			}
			console.log('Database connected');
			db.collection('packets', function(err, collection) {
				if(err) {
					console.dir(err);
					process.exit(1);
				}
				packets = collection;
				console.log('Database initialized');
			});
		});
	}

	this.insert = function(packet) {
		if(packets == null) {
			console.log('Database is not yet initialized. Packet lost');
			return;
		}
		packets.insert(packet);
	}
	
	this.find = function(query) {
		return packets.find(query);
	}
};

module.exports = DltDatabase;