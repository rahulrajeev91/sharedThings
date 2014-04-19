/* 
CP3101B Assignment 3 - exercise 7 Server
Improving performance and scalability
*/

var config = require('./config_node.js');

var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: config.port});

var Changes = {};
var defaultWorld = {
	"x1":{"top":8,"left":8},
	"x2":{"top":8,"left":8},
	"x3":{"top":8,"left":8},
	"x4":{"top":8,"left":8},
	"x5":{"top":8,"left":8},
	"o1":{"top":8,"left":100},
	"o2":{"top":8,"left":100},
	"o3":{"top":8,"left":100},
	"o4":{"top":8,"left":100},
	"o5":{"top":8,"left":100},
	"tttboard":{"top":100,"left":8}
};
var World = defaultWorld;		//contains the stored global world 

wss.on('close', function() {
    console.log('disconnected');
});

wss.broadcast = function(data,sender) {
    for(var i in this.clients)
    	if(this.clients[i] != sender)	//send the new world to to all the clients excepth the sender.
        	this.clients[i].send(data);
};

wss.on('connection', function(ws) {

	if(World == {})
		World = defaultWorld;
	ws.send(JSON.stringify(World)); // initial state

	ws.on('message', function(RecievedWorld) {
		//World=JSON.parse(RecievedWorld);
		Changes = JSON.parse(RecievedWorld);
		console.log('\n============================\nreceived: %s', JSON.stringify(Changes));

		//update the World
		for (var value in Changes){
		  World[value] = Changes[value];
		}

		//update only the changees to the world
		wss.broadcast(JSON.stringify(Changes),ws);	
	});
});
