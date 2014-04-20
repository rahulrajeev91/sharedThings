/* 
CP3101B Assignment 3 - exercise 8 Server
Including World ID and allowing users to choose/create world to share
*/

var config = require('./config_node.js');

var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: config.port});

var Changes = {};
var stateChanges = {};
var Universe = [];		//contains the stored global world 

wss.on('close', function() {
    console.log('disconnected');
});

wss.broadcast = function(data,sender) {
    for(var i in this.clients)
    	if(this.clients[i] != sender)	//send the new world to to all the clients excepth the sender.
        	this.clients[i].send(data);
};

wss.broadcastAll = function(data,sender) {
    for(var i in this.clients)
    	this.clients[i].send(data);
};

wss.on('connection', function(ws) {

	//wss.broadcastAll(Universe, ws);
	ws.on('message', function(RecievedWorld) {
		//World=JSON.parse(RecievedWorld);
		Changes = JSON.parse(RecievedWorld);
		console.log('\n============================\nreceived: %s', JSON.stringify(Changes));

		//update the World
		stateChanges = Changes["state"];
		for (var i in Universe)
		{
			if(Universe[i].wid == Changes["wid"])
			{
				for(var value in stateChanges)
					Universe[i].state[value] = stateChanges[value];
			}
		}
		// if(Universe == null)
		// 	Universe[0] = Changes;
		//console.log(JSON.stringify(Universe[0].state));	
		//update only the changees to the world
		wss.broadcast(JSON.stringify(Changes),ws);	
	});
});
