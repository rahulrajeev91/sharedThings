/* 
CP3101B Assignment 3 - exercise 9 Server
Including World ID and allowing users to choose/create world to share, enable chat and multiple games

Input Data : {"type":"<Type of request>",wid":"<NameOfWorld>", "state":"<Hash containing all the changed states>", 
				"game":"<game ID>" , "msg":"<msg as a string>"}

	type:
		"worldIDChange"	: World ID Changed
		"getWorldState"	: Get world state
		"updateWorld"	: sending updated world
		"msg"			: broadcast msg

Output Data : {"type":"<Type of data>",wid":"<NameOfWorld>", "state":"<Hash containing all the changed states>", 
				"worlds":"<array of all the world names>", "game":"<game ID>", "msg":"<msg as a string>"}

	type:
		"worldList"		: Sending World name List
		"worldState"	: sending world state
		"updateWorld"	: sending world state changes
		"msg"			: broadcast msg
*/

var config = require('./config_node.js');

var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: config.port});

var changedWorld = {};
var worldId = "";
var gameId = 1;
var dataType = "";
var stateChanges = {};
var Universe = new Array();		// contains the the states of all the worlds
var Worlds = new Array();		// array containing the name of all the worlds

var returnData = {};

wss.on('close', function() {
    console.log('disconnected');
});

wss.broadcast = function(data,sender) {
    for(var i in this.clients)
    	if(this.clients[i] != sender)	//send the new world to to all the clients excepth the sender.
        	this.clients[i].send(data);
};

wss.broadcastAll = function(data) {
    for(var i in this.clients)
    	this.clients[i].send(data);
};

wss.on('connection', function(ws) {

	returnData = {};
	returnData["type"] = "worldList";
	returnData["worlds"] = Worlds;

	ws.send(JSON.stringify(returnData));
	console.log("new client");

	ws.on('message', function(RecievedWorld) {
		

		// Display the data //////////////////////////////////////////////////////////////////////////
		changedWorld = JSON.parse(RecievedWorld);
		console.log('\n============================\nreceived: %s',JSON.stringify(changedWorld));

		// Extract information from the input data////////////////////////////////////////////////////
		dataType = changedWorld["type"];
		stateChanges = changedWorld["state"];
		worldId = changedWorld["wid"];
		gameId = changedWorld["game"];

		// process data //////////////////////////////////////////////////////////////////////////////

		if (worldId =="")
			return;

		returnData = {};

		if(dataType=="worldIDChange"||dataType=="getWorldState"){
			flag=0;
			for (var i in Universe)
			{
				if(Universe[i].wid == worldId)
				{
					returnData = Universe[i];
					returnData["type"] = "worldState";
					returnData["worlds"] = Worlds;
					ws.send(JSON.stringify(returnData));	
					return;	
				}
			}
		}
		else if(dataType=="updateWorld") {
			
			flag=0;
			for (var i in Universe) {
				if(Universe[i].wid == worldId) {
					//searching universe for the correct world ID
					for(var value in stateChanges)
						Universe[i].state[value] = stateChanges[value];
					Universe[i]["game"] = gameId;
					
					returnData["type"] = "updateWorld";
					returnData["state"] = stateChanges;
					returnData["worlds"] = Worlds;
					returnData["wid"] = worldId;
					returnData["game"] = gameId;

					wss.broadcast(JSON.stringify(returnData),ws);	
					return;
				}
			}
		}
		else if(dataType=="msg"){
			returnData["type"] = "msg";
			returnData["wid"] = worldId;
			returnData["msg"] = changedWorld["msg"];

			wss.broadcastAll(JSON.stringify(returnData),ws);	
			return;
		}

		// checking to make sure if new world has been added
		console.log("\nAdded to universe : "+ worldId);

		var tempWorld = {};
		tempWorld["wid"] = worldId;
		tempWorld["state"] = stateChanges;
		tempWorld["game"] = gameId;

		Universe.push(tempWorld);
		Worlds.push(worldId);

		returnData["type"] = "worldList";
		returnData["worlds"] = Worlds;

		wss.broadcastAll(JSON.stringify(returnData));

	});
});
