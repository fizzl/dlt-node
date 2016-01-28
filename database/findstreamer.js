const util = require('util');

var FindStreamer = function(request, response, database, query) {
	var self = this;
	this.request = request;
	this.response = response;
	this.database = database;
	this.query = query;
	
	this.execute = function() {
		self.response.writeHead(200, {
			'Content-Type': 'application/json'
		});
		console.dir(self.query);
		var find = self.database.find(self.query,null ,function(err, result) {
			if(err) {
				self.response.send(util.inspect(err));
				return;
			}
		});
		self.response.write('[');
		var stream = find.stream();
		stream.on('data', function(item) {
			self.response.write(JSON.stringify(item, null, 2));
			self.response.write(',\n');
		});
		stream.on('end', function() {
			self.response.write('{}]');
			self.response.end();
		});
	}	
}

module.exports = FindStreamer;