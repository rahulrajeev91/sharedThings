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
	//updating local copy of world
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
	   		document.getElementById("chat-box").innerHTML = weatherinfo[0]['main'];
	   		$('#bg').css('background-image','url(images/background/thunderstorm.jpg)');
	   }
      else if (weatherinfo[0]['main'] == "Drizzle")
      {
	   		document.getElementById("chat-box").innerHTML = weatherinfo[0]['main'];
	   		$('#bg').css('background-image','url(images/background/rain.jpg)');
	   }
      else if (weatherinfo[0]['main'] == "Rain")
      {
	   		document.getElementById("chat-box").innerHTML = weatherinfo[0]['main'];
	   		$('#bg').css('background-image','url(images/background/rain.jpg)');
	   }
      else if (weatherinfo[0]['main'] == "Snow")
      {
	   		document.getElementById("chat-box").innerHTML = weatherinfo[0]['main'];
	   		$('#bg').css('background-image','url(images/background/snow.jpg)');
	   }
      else if (weatherinfo[0]['main'] == "Clouds")
	  {
	   		document.getElementById("chat-box").innerHTML = weatherinfo[0]['main'];
	   		$('#bg').css('background-image','url(images/background/clouds.jpg)');
	  }
      else if (weatherinfo[0]['main'] == "Extreme")
      {
	   		document.getElementById("chat-box").innerHTML = weatherinfo[0]['main'];
	   		$('#bg').css('background-image','url(images/background/thunderstorm.jpg)');
	   }
      else
      {
	   		document.getElementById("chat-box").innerHTML = weatherinfo[0]['main'];
	   		$('#bg').css('background-image','url(images/background/clear.jpg)');
	   }
    }
    else
      ;//error
  }
});   
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

	//Geolocation
    var timeoutVal = 10 * 1000 * 1000;
    navigator.geolocation.getCurrentPosition( displayPosition, displayError, { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 });

    //Shake  
    window.addEventListener ("devicemotion", handleMotionEvent, true);
});