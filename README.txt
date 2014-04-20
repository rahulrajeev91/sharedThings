======================================================================================================================
					INSTALLATION INSTRUCTIONS & POINTERS (ASSIGNMENT 3 | CP3101B)
======================================================================================================================

Third assignment for web applications module - Shared Things (using HTML5,JSON,JQuery,Node.js,WebSockets,Bootstrap,AJAX)

INSTALLATION INSTRUCTIONS:
	
1.	Install the unzipped files into a sharedThings Directory on your server.
	
2. 	Modify the following variables in config.js and cpnfig_node.js to match your specs:
	var port=" ";
	
3.	For running Exercise 6:
	node e4server.js (In the console)
	Open e6.html in the browser

4.	For running Exercise 7:
	node e7server.js (In the console)
	Open e7.html (multiple windows preferably) in the browser

5. For running Exercise 8:
	node e8server.js (In the console)
	Open e8.html (multiple windows preferably) in the browser

6. For running Exercise 9:
	node main.js (In the console)
	Open index.html (multiple windows preferably) in the browser (preferably mobile devices Nozilla Firefox. Chrome window doesn't show background accurately)

CREATIVE ADDITIONS:

1. Multiple games: Checkers and tic-tac-toe
2. Chat box
3. Shake to reset
4. Background of the application changes based on weather obtained from user's geolocation
	TIP: Modify the latitude and longitude values in the function weather () in main.js
	$api_url = "http://api.openweathermap.org/data/2.5/weather?lat="+ curr_Latitude + "&lon=" + curr_Longitude; 

	Values of curr_Latitude and curr_Longitude can be modified to see changes in background if the weather in the said places are different :)
