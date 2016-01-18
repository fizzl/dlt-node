exports.DLT_HOST = 'localhost'
exports.DLT_PORT = 3490
exports.PORT = 8080

exports.parseCommandLine = function() {
	process.argv.forEach((val, index, array) => {
		switch(val.toLowerCase()) {
			case '--dlt-host':
				exports.DLT_HOST = array[index+1];
				break;
			case '--dlt-port':
				exports.DLT_PORT = array[index+1];
				break;
			case '--port':
				exports.PORT = array[index+1];
				break;
		};
	});
}
