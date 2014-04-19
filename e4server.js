

var config = require('./config_node.js');

var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: config.port});
var World ={};		//contains the stored global world 
wss.on('close', function() {
    console.log('disconnected');
});

wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
};

wss.on('connection', function(ws) {
	ws.send(JSON.stringify(World)); // ibnitial state

	ws.on('message', function(RecievedWorld) {
		World=JSON.parse(RecievedWorld);
		console.log('\n============================\nreceived: %s', JSON.stringify(World));
		wss.broadcast(JSON.stringify(World));
	});
});
