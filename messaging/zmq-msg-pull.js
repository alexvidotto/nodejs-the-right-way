"use strict";

const
  zmq = require('zmq'),
  pusher = zmq.socket('push'),
  puller = zmq.socket('pull');

puller.on('message', function(data){
  console.log('Pulled msg: ', JSON.parse(data));
});

pusher.bind('ipc://msg-puller.ipc');
puller.connect('ipc://msg-pusher.ipc');

console.log('Sending conn confirmation.');
pusher.send('connected.');
