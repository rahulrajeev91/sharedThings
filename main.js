var DefaultWorld= {
	"x1":{"top":86,"left":46},
	"x2":{"top":86,"left":46},
	"x3":{"top":86,"left":46},
	"x4":{"top":86,"left":46},
	"x5":{"top":86,"left":46},
	"o1":{"top":86,"left":111},
	"o2":{"top":86,"left":111},
	"o3":{"top":86,"left":111},
	"o4":{"top":86,"left":111},
	"o5":{"top":86,"left":111},
	"tttboard":{"top":191,"left":122},
	"b1":{"top":91,"left":52},
	"b2":{"top":202,"left":384},
	"b3":{"top":202,"left":273},
	"b4":{"top":202,"left":163},
	"b5":{"top":202,"left":52},
	"b6":{"top":147,"left":440},
	"b7":{"top":147,"left":329},
	"b8":{"top":147,"left":219},
	"b9":{"top":147,"left":109},
	"b10":{"top":91,"left":384},
	"b11":{"top":91,"left":273},
	"b12":{"top":91,"left":163},
	"r1":{"top":422,"left":164},
	"r2":{"top":367,"left":438},
	"r3":{"top":367,"left":329},
	"r4":{"top":367,"left":219},
	"r5":{"top":367,"left":108},
	"r6":{"top":422,"left":384},
	"r7":{"top":422,"left":275},
	"r8":{"top":422,"left":52},
	"r9":{"top":477,"left":439},
	"r10":{"top":477,"left":328},
	"r11":{"top":477,"left":218},
	"r12":{"top":477,"left":109},
	"chboard":{"top":86,"left":46}
};

var socket;
world = {};
worldChanges = {};

function postComment(){
	console.log("commnet :" + $("#comment-input").val());
	$("#chat-box").append($("#comment-input").val()+ "<hr/>");
	$("#comment-input").val("");
}

function logDrag(event, ui){
	// //updating local copy of world
	$("#world img").each(function(){
		world[$(this).attr("id")] = $(this).position();
	});
	console.log(JSON.stringify(world));

	var changes = {};
	changes[event.target.id] = ui.offset;
	socket.send(JSON.stringify(changes));
}

function ChooseGame(game){
	console.log("Choosing game : "+game);
	if(game==0){
		document.getElementById("ttt").style.visibility='hidden';
		document.getElementById("checkers").style.visibility='hidden';
	}
	if(game==1){
		document.getElementById("ttt").style.visibility='visible';
		document.getElementById("checkers").style.visibility='hidden';
	}
	else if(game==2){
		document.getElementById("ttt").style.visibility='hidden';
		document.getElementById("checkers").style.visibility='visible';
	}
}

function resetWorldForAll(){
	resetWorld();
	socket.send(JSON.stringify(DefaultWorld));
}

function resetWorld(){
	for (var value in DefaultWorld){
	  
	  $("#"+value).offset(DefaultWorld[value]);
	}
	console.log("Resetting World");
	//world = DefaultWorld;
}

$(function() { 
	resetWorld();
	ChooseGame(1);
	
	socket = new WebSocket("ws://"+server+":"+port);
	socket.onopen = function (event) {
		console.log("connected");
	};
	socket.onclose = function (event) {
		alert("Server Disconnected. Pls Reconnect or Refresh")
		console.log("closed code:" + event.code + " reason:" +event.reason + " wasClean:"+event.wasClean);
	};

	socket.onmessage = function (event) {
		worldChanges= JSON.parse(event.data);
		for (var value in worldChanges){
		  console.log(value + " -> " + JSON.stringify(worldChanges[value]));
		  world[value] = worldChanges[value];   //updating local copy of world

		  $("#"+value).offset(worldChanges[value]);
		}
	}

	// $("#world img").draggable(); 
	$(".draggable").draggable({containment: "#world", scroll: false}); 
	$("#world img").on("dragstart", function(event, ui) { logDrag(event, ui); });
	$("#world img").on("dragstop" , function(event, ui) { logDrag(event, ui); });
	$("#world img").on("drag"     , function(event, ui) { logDrag(event, ui); });
});