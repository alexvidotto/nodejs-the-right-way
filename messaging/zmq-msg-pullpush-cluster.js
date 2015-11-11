// alexvidotto

"use strict";

const
  cluster = require('cluster'),
	zmq = require('zmq');

if (cluster.isMaster) {
	let
	  maxWorkers = 3,
	  readyWorkers = 0,
	  pusher = zmq.socket('push').bind('ipc://jobs.ipc'),
		puller = zmq.socket('pull').bind('ipc://jobs-return.ipc');
	
	puller.on('message', function(data) {
		let msg = JSON.parse(data.toString());
	 	if ('ready' in msg)	{
			// if all workers is ready, send jobs.
			if(++readyWorkers == maxWorkers) {
				_sendJobs(10);
			}
		} else {
			// show the job result
			console.log("Job " + msg.jobId + " Finished by worker: " + msg.pid);
		}
	});

	function _sendJobs(i) {
		while (i--) {
			pusher.send(JSON.stringify({
				details: 'This is a Job.',
				timestamp: Date.now(),
				jobId: i
			}));
		}
	}

	cluster.on('online', function(worker){
		console.log('Worker ' + worker.process.pid + ' is online.');
	});

	for (let i=1; i<=maxWorkers; i++){
		cluster.fork();
	}
} else {

	// create sockets to the current worker
	let 
	  pusherW = zmq.socket('push'),
		pullerW = zmq.socket('pull');

	pusherW.connect('ipc://jobs-return.ipc');
	pullerW.connect('ipc://jobs.ipc');

	// send ready signal
  pusherW.send(JSON.stringify({
		ready: 1,
		pid: process.pid
	}));
	
  pullerW.on('message', function(data){
		let jobDetails = JSON.parse(data);
		console.log('Worker ' + process.pid + ' receive jobId ' + jobDetails.jobId);
		// handle job
		jobDetails.status = 'finished';
		jobDetails.complete = Date.now();
		jobDetails.pid = process.pid;
		// send job result
		pusherW.send(JSON.stringify(jobDetails));
	});		
}
