"use strict";
const
  net = require('net'),
  server = net.createServer(function(connection){
		
		console.log('Subscriber connected.');
		
		// send the first chunk imediately
		connection.write(
			'{"type":"changed","file":"targ'
		);
    
		// after a one second delay, send the other chunk
		let timer = setTimeout(function(){
	  	connection.write('et.txt", "timestamp":13581757578495}'+"\n");
			connection.end();
		}, 1000);

		connection.on('end', function(){
			clearTimeout(timer);
			console.log('Subscriber disconnected.')
		});
	});

	server.listen(5431, function(){
		console.log('Test server listening for subscribers...');
	});
