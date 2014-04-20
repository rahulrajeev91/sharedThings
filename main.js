
///Variables ////////////////////////////////////////////////////////////////////////////////////
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

var worldId = "";
var gameId = 1;
var world = {};
var dataToSend = {};

var dataReceived = {};
var dataType = "";
var dataID= "";
var stateChanges = {};
var worldsArray = new Array();

//var worldChanges = {};

/// Functions ////////////////////////////////////////////////////////////////////////////////////

function postComment(){
	console.log("commnet :" + $("#comment-input").val());
	
	if (worldId != ""){
		dataToSend = {};
		dataToSend["state"] = {};
		dataToSend["wid"] = worldId;
		dataToSend["type"] = "msg";
		dataToSend["game"] = gameId;
		dataToSend["msg"] = $("#comment-input").val().trim();
		socket.send(JSON.stringify(dataToSend));
	}
	else
		$("#chat-box").append("Pls select a world first<hr/>");

	$("#comment-input").val("");
}

function logDrag(event, ui){
	// //updating local copy of world
	// $("#world img").each(function(){
	// 	world[$(this).attr("id")] = $(this).position();
	// });
	// console.log(JSON.stringify(world));

	var changes = {};
	changes[event.target.id] = ui.offset;

	dataToSend = {};
	dataToSend["state"] = changes;
	dataToSend["wid"] = worldId;
	dataToSend["type"] = "updateWorld";
	dataToSend["game"] = gameId;
	socket.send(JSON.stringify(dataToSend));
}

function setWorldId(val){

	if(worldId!=val.trim())
		$("#chat-box").html("");
	worldId = val.trim();
	$("#world-dropdown").html(worldId);
	hideWelcomeMsg();

}

function updateGame(game){
	if(game==0){
		document.getElementById("ttt").style.visibility='hidden';
		document.getElementById("checkers").style.visibility='hidden';
	}
	if(game==1){
		gameId = game;
		document.getElementById("ttt").style.visibility='visible';
		document.getElementById("checkers").style.visibility='hidden';
	}
	else if(game==2){
		gameId = game;
		document.getElementById("ttt").style.visibility='hidden';
		document.getElementById("checkers").style.visibility='visible';
	}
}

function ChooseGame(game){
	console.log("Choosing game : "+game);

	if(game==1||game ==2){
		gameId = game;
		dataToSend = {};
		dataToSend["state"] = {};
		dataToSend["wid"] = worldId;
		dataToSend["type"] = "updateWorld";
		dataToSend["game"] = gameId;
		socket.send(JSON.stringify(dataToSend));
		updateGame(gameId);
	}
}

function hideWelcomeMsg(){
	document.getElementById("welcome").style.visibility='hidden';
	updateGame(1);
}

function resetWorldForAll(){
	resetWorld();

	dataToSend = {};
	dataToSend["state"] = DefaultWorld;
	dataToSend["wid"] = worldId;
	dataToSend["type"] = "updateWorld";
	dataToSend["game"] = gameId;
	socket.send(JSON.stringify(dataToSend));
}

function resetWorld(){
	for (var value in DefaultWorld){
	  $("#"+value).offset(DefaultWorld[value]);
	}
	console.log("Resetting World");
	//world = DefaultWorld;
}

function changeWorld(val){
	setWorldId(worldsArray[val]);

	dataToSend = {};
	dataToSend["state"] = {};
	dataToSend["wid"] = worldId;
	dataToSend["type"] = "worldIDChange";
	dataToSend["game"] = 1;
	resetWorld();
	socket.send(JSON.stringify(dataToSend));
}

$(function() { 
	resetWorld();
	updateGame(0);
	
	socket = new WebSocket("ws://"+server+":"+port);
	socket.onopen = function (event) {
		console.log("connected");
	};
	socket.onclose = function (event) {
		alert("Server Disconnected. Pls Reconnect or Refresh")
		console.log("closed code:" + event.code + " reason:" +event.reason + " wasClean:"+event.wasClean);
	};

	socket.onmessage = function (event) {
		// worldChanges= JSON.parse(event.data);
		// for (var value in worldChanges){
		//   console.log(value + " -> " + JSON.stringify(worldChanges[value]));
		//   world[value] = worldChanges[value];   //updating local copy of world

		//   $("#"+value).offset(worldChanges[value]);
		// }

		console.log(event.data);
		dataReceived= JSON.parse(event.data);

		var dataType =  dataReceived["type"];

		if (dataType == "msg"){
			if(worldId == dataReceived["wid"]){
				$("#chat-box").append(dataReceived["msg"]+ "<hr/>");
				return;
			}
		}
		//if (dataType == "worldList"){
		worldsArray = dataReceived["worlds"];
		$("#worldList").html("<li class=\"dropdown-header\">Select a World</li>");
		for (var i in worldsArray) {
			$("#worldList").append("<li><a href=\"#\" onclick = \"changeWorld("+i+")\">"+worldsArray[i]+"</a></li>");
		}
		if (worldsArray.length == 0)
			$("#worldList").html("<li class=\"dropdown-header\">No Worlds defined. Add a new one. </li>");

		if (dataType == "worldState" || dataType == "updateWorld"){
			if(worldId == dataReceived["wid"]){
				hideWelcomeMsg();
				stateChanges = dataReceived["state"];
				for (var value in stateChanges){
					//console.log(value + " -> " + JSON.stringify(stateChanges[value]));
					$("#"+value).offset(stateChanges[value]);
				}
				updateGame(dataReceived["game"]);
			}
		}
		

	}

	$( "#newWorldForm" ).submit(function( event ) {
		event.preventDefault();
		setWorldId($("#newWorldName").val().trim());
		// $("#worldList").append($("#NewWorldName").val()+"<br/>");
		$("#newWorldName").val("");

		dataToSend = {};
		dataToSend["state"] = {};
		dataToSend["wid"] = worldId;
		dataToSend["type"] = "worldIDChange";
		dataToSend["game"] = 1;
		resetWorld();
		socket.send(JSON.stringify(dataToSend));
	});


	// $("#world img").draggable(); 
	$(".draggable").draggable({containment: "#world", scroll: false}); 
	$("#world img").on("dragstart", function(event, ui) { logDrag(event, ui); });
	$("#world img").on("dragstop" , function(event, ui) { logDrag(event, ui); });
	$("#world img").on("drag"     , function(event, ui) { logDrag(event, ui); });

	//Geolocation
    var timeoutVal = 10 * 1000 * 1000;
    navigator.geolocation.getCurrentPosition( displayPosition, displayError, { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 });

    //Shake  
    window.addEventListener ("devicemotion", handleMotionEvent, true);
});



///Mobile UI Features////////////////////////////////////////////////////////////////////////////////////

function round(a){
	return Math.round(100*a)/100;
}

function handleMotionEvent (event){
	ax = round(event.acceleration.x);
	ay = round(event.acceleration.y);
	az = round(event.acceleration.z);
	aRms = round(Math.sqrt(Math.pow(ax,2) + Math.pow(ay,2) + Math.pow(az,2)));
	console.log("ax: " + ax + " ay: " + ay + " az: " + az + " aRms: " + aRms);
		
	// rrx = round(event.rotationRate.beta);
	// rry = round(event.rotationRate.gamma);
	// rrz = round(event.rotationRate.alpha);
	// rrRms = round(Math.sqrt(Math.pow(rrx,2) + Math.pow(rry,2) + Math.pow(rrz,2)));
	// console.log("rrx: " + rrx + " rry: " + rry + " rrz: " + rrz + " rrRms: " + rrRms);

	if((aRms > 15))// && (rrRms > 5))
	{
		var result = confirm("Reset game for everyone?");
		if(result == true)
		    resetWorldForAll();
	}
}

function displayError(error) 
{
  var errors = { 1: 'Permission denied', 2: 'Position unavailable', 3: 'Request timeout' };
  console.log("Error: " + errors[error.code]);
}

function displayPosition(position) 
{
curr_Latitude = round(position.coords.latitude);
curr_Longitude = round(position.coords.longitude);
console.log("Latitude: " + curr_Latitude + ", Longitude: " + curr_Longitude);
weather();
}

function weather() 
{
	$api_url = "http://api.openweathermap.org/data/2.5/weather?lat="+ curr_Latitude + "&lon=" + curr_Longitude;
	$.ajax({
	  dataType: 'json',
	  url: $api_url,
	  success: function(json)
	  {
	    console.log(JSON.stringify(json));
	    if (json["cod"] =='200'){
	      var weatherinfo = json['weather'];
	      if(weatherinfo[0]['main'] == "Thunderstorm")
	      {
		   		console.log(weatherinfo[0]['main']);
		   		$('#bg').css('background-image','url(images/background/thunderstorm.jpg)');
		   }
	      else if (weatherinfo[0]['main'] == "Drizzle")
	      {
		   		console.log(weatherinfo[0]['main']);
		   		$('#bg').css('background-image','url(images/background/rain.jpg)');
		   }
	      else if (weatherinfo[0]['main'] == "Rain")
	      {
		   		console.log(weatherinfo[0]['main']);
		   		$('#bg').css('background-image','url(images/background/rain.jpg)');
		   }
	      else if (weatherinfo[0]['main'] == "Snow")
	      {
		   		console.log(weatherinfo[0]['main']);
		   		$('#bg').css('background-image','url(images/background/snow.jpg)');
		   }
	      else if (weatherinfo[0]['main'] == "Clouds")
		  {
		   		console.log(weatherinfo[0]['main']);
		   		$('#bg').css('background-image','url(images/background/clouds.jpg)');
		  }
	      else if (weatherinfo[0]['main'] == "Extreme")
	      {
		   		console.log(weatherinfo[0]['main']);
		   		$('#bg').css('background-image','url(images/background/thunderstorm.jpg)');
		   }
	      else
	      {
		   		console.log(weatherinfo[0]['main']);
		   		$('#bg').css('background-image','url(images/background/clear.jpg)');
		   }
	    }
	    else
	      ;//error
	  }
	});   
}