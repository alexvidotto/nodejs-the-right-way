"use strict";

const
  zmq = require('zmq'),
  pusher = zmq.socket('push'),
  puller = zmq.socket('pull');

puller.on('message', function(data){
  console.log(data.toString());
  
  for (let i=0; i<100; i++){
    pusher.send(JSON.stringify({
      details: 'Details about job: ' + i
    }));
  }
});

puller.connect('ipc://msg-puller.ipc');
pusher.bind('ipc://msg-pusher.ipc', function(){
  console.log('Waiting puller...');
});
