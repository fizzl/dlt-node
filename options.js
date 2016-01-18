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
