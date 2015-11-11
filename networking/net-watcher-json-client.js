"use strict";
const
  net = require('net'),
  client = net.connect({port: 5431});

let output = '';
client.on('data', function (data){
	if(~data.indexOf('\n')) {
		output += data;
		var d = output.split('\n');
		for (var i = 0, o; o = d[i]; i++){
			let message = JSON.parse(o);
			if (message.type == 'watching'){
				console.log("Now watching: " + message.file);
			} else if (message.type === 'changed'){
				let date = new Date(message.timestamp);
				console.log("File " + message.file + "' changed at " + date);
			} else {
				throw Error("Unrecognized message type: " + message.type);
			}
		}
		output = '';
	} else {
		output += data;
	}
});
