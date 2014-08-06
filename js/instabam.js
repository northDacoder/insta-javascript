$(document).ready(function(){
     	
 	var latitude;
    var longitude; 

    Number.prototype.toRad = function() { return this * (Math.PI / 180); };
   
    var dataArr = [];
    var cleanData = [];

    var usertoken = '';

    function loadHtml() {
    	
        for (var i = 0; i < cleanData.length; i++) {
        		
    		// // INSTAGRAM JSON DATA INTO HTML 
    		// var imagesHTML = 
    		
    		// // IMAGE CONTAINER 
    		// '<ul class="imageCard col-xs-12 col-sm-6 col-md-4 col-lg-4">' +
      //   			'<a href="' + cleanData[i].link + '">' + 
      //       		'<img src="' + cleanData[i].imageUrl + '" class="img-circle img-responsive" />' +
      //       		'<img src="images/vectorPin3.png" class="img-responsive pinBackground" />' +
        	
      //   	// TEXT OVERLAY 
      //   	'<div class="imageoverlay">' + 
      //       		'<span class="distancetag">' + cleanData[i].distance + '  Miles' + '</span>' + '<br>' + 
      //       		'<span class="locationtag">"' + cleanData[i].locationName + '"</span>' + '<br>' + 
      //       		'<span class="timetag">' + cleanData[i].createdTime + '</span>' + '<br>' + 
      //       		// '<span class="likestag">' + cleanData[i].likes + ' likes</span>' + '<br>' + 
      //   	'</div>' +

      //   	'</a>' + '<br>' + 

      //   	// USERNAME TEXT DISPLAY 
      //   	'<h1 class="usernametag">' + cleanData[i].userName + '</h1>' + '<br>' +
    		// '</ul>';

      //       $("#instafeed").append(imagesHTML);

            var username = cleanData[i].userName;
            $("#username").html(username);

            var userimage = cleanData[i].imageUrl;
            $("img#userimage").attr('src', userimage);

            var userdistance = cleanData[i].distance;
            $("#userdistance").html(userdistance);

            var locationtag = cleanData[i].locationName;
            $("#locationtag").html(locationtag);

            var timetag = cleanData[i].createdTime;
            $("#timetag").html(timetag);

            var likestag = cleanData[i].likes;
            $("#likestag").html(likestag);
        } 
    }

        
    // SUCCESS FUNCTION TO GET USER PERMISSION FOR CURRENT LATITUDE & LONGITUDE 
    function success(position) {
    	latitude = Number(position.coords.latitude);
    	longitude = Number(position.coords.longitude); 

    	// CALL TO GETDATA FUNCTION THAT WILL MAKE THE INSTAGRAM API REQUEST & STORE THE JSON DATA RESPONSE 
    
    	getData(); 
    }
        

    // FUNCTION TO SORT THE JSON DATA RETURNED FROM INSTAGRAM 
    function sliceData(arr) {
        	
    	var sliceArr = arr; 

    	for (var i = 0; i < sliceArr.length; i++) {
    
			if (sliceArr[i].location != null) {
				var imageObj = {}; 
				var imgLat = sliceArr[i].location.latitude;
				var imgLon = sliceArr[i].location.longitude;
				var latitudeRad = latitude.toRad();
				var imgLatRad = imgLat.toRad();
				var distanceLat = (imgLat - latitude).toRad();
				var distanceLon = (imgLon - longitude).toRad();

				var R = 6371; // km
				var a = Math.sin(distanceLat/2) * Math.sin(distanceLat/2) + Math.sin(distanceLon/2) * Math.sin(distanceLon/2) * Math.cos(latitudeRad) * Math.cos(imgLatRad); 
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
				var distanceKilo = R * c;
				var distanceMiles = Math.round((distanceKilo * 3)/5);

				imageObj["distance"] = distanceMiles; 
				imageObj["userName"] = sliceArr[i].caption.from.username; 
				imageObj["locationName"] = sliceArr[i].location.name;
				imageObj["imageUrl"] = sliceArr[i].images.low_resolution.url;
				imageObj["createdTime"] = new Date(Number(dataArr[i].created_time) * 1000).toDateString();
				imageObj["likes"] = dataArr[i].likes.count; 
				imageObj["link"] = dataArr[i].link;
		
				cleanData.push(imageObj);
   			}
		}
    
    	cleanData.sort(function(a, b){
        	return a.distance - b.distance; 
    	});

    	loadHtml(); 
    }

    var clientid = '6b92c7f8541b49f6a27b7d8034bfe1e3';
    var redirect = 'https://whosnear.firebaseapp.com';
    // var usertoken = token;

    // FUNCTION FOR MAKING API 'GET' REQUEST TO INSTAGRAM
    function getData() {
        $.ajax({
            type: 'GET',
            // url: "https://api.instagram.com/v1/tags/search?q=oshie&access_token=4489780.16de7c3.328969cef4274f3cbb8ebed09333c30e",
            url: "https://api.instagram.com/v1/users/self/feed?access_token=" + usertoken,
            // url: 'https://api.instagram.com/oauth/authorize/?client_id=' + clientid + '&redirect_uri=' + redirect + '&response_type=token',
            dataType: 'jsonp',
            success: function(json) {
                dataArr = json.data;  
                sliceData(dataArr); 
            }
        });
    }


    // FUNCTION TO DISPLAY ERROR MESSAGE FOR USER WITHOUT HTML5 OR FOR DENIED REQUEST TO TRACK LOCATION 
    function error(msg) {
    	console.log(msg);
    } 

    
    // CHECK TO SEE IF GEOLOCAITON EXISTS
    if (navigator.geolocation) {
        console.log("Geolocation found, getting coordinates now..."); 
        navigator.geolocation.getCurrentPosition(success, error); 
        urlarray = window.location.hash.split("=");
        usertoken = urlarray[1];
        
    } else {
        console.log("Geolocation not found, please try again!");
        error("not supported"); 
    }
       
});
