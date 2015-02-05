$(document).ready(function(){

    /* Define 2 variables that will start with no values, once the users geolocation is available
    these values will be reassigned to the actual latitude & longitude values */
    var latitude;
    var longitude;

    Number.prototype.toRad = function() { return this * (Math.PI / 180); };

    var dataArr = [];
    var cleanData = [];

    var usertoken = '';

    function loadHtml() {

        for (var i = 0; i < cleanData.length; i++) {

            var imagesHTML =

            '<div class="col-sm-4 col-sm-offset-4">' +
            '<center><img src="' + cleanData[i].user_profile_pic + '" class="img-circle img-responsive" style="border: 10px solid rgba(53,120,177,.5); text-shadow: 0px 0px 10px #333; box-shadow: 0px 0px 20px rgba(0,0,0,.4);"></center>' +
            '<p class="lead text-center" style="font-size: 16px; color: white; margin-top: 15px; text-shadow: 0px 0px 10px #333;"><i class="fa fa-clock-o"></i> ' + cleanData[i].created_time + ' <br><i class="fa fa-map-marker"></i> ' + cleanData[i].distance + ' miles away' + '</p>' +
            '<p class="lead text-center" style="font-size: 16px; color: white; position: relative; bottom: 20px; text-shadow: 0px 0px 10px #333;"><i class="fa fa-user"></i> ' + cleanData[i].user_name + '</p>' +
            '</div>';


            $("#instafeed").append(imagesHTML);


            var imagesHTML =    '<a href="' + cleanData[i].link + '" class="col-xs-12 col-sm-8 col-sm-offset-2" id="profile-card">' +
                                          '<div class="row"' +
                                              '<center><img src="' + cleanData[i].user_profile_pic + '" class="img-circle img-responsive pull-left" /></center>' +
                                              '<h1 class="text-center">@' + cleanData[i].user_name + '</h1>' +
                                              '<p class="lead"><i class="fa fa-map-marker"></i>' + cleanData[i].distance + '  Miles</p>' +
                              		        '<center><img src="' + cleanData[i].image_url + '" class="img-rounded img-responsive" ></center>' +
                              		        '<span class="text-center"><i class="fa fa-map-marker" id="largepin"></i></span>' +

                                      		'<h3 class="text-center">' + cleanData[i].location_name + '</h3>' +
                                      		'<h3 class="text-center">' + cleanData[i].created_time + '</h3>' +
                                      		// '<h3 class="text-center">' + cleanData[i].comments + ' likes</h3>' +
                                              // '<h3 class="text-center">' + cleanData[i].tags + ' likes</h3>' +
                                              '<h3 class="text-center">' + cleanData[i].user_full_name + ' likes</h3>' +
                                          '</div>' +
                 		                '</a>';



            // var username = cleanData[i].userName;
            // $("#username").html(username);

            // var userimage = cleanData[i].imageUrl;
            // $("img#userimage").attr('src', userimage);

            // var userdistance = cleanData[i].distance;
            // $("#userdistance").html(userdistance);

            // var locationtag = cleanData[i].locationName;
            // $("#locationtag").html(locationtag);

            // var timetag = cleanData[i].createdTime;
            // $("#timetag").html(timetag);

            // var likestag = cleanData[i].likes;
            // $("#likestag").html(likestag);
        }
    }




    function sliceData(arr) {

        var sliceArr = arr;

        for (var i = 0; i < sliceArr.length; i++) {
            var imageObj = {};
            imageObj["comments"] = sliceArr[i].caption;

            // User Comments
            // imageObj["comments_user"] = sliceArr[i].caption.from.username;
            // imageObj["comments_name"] = sliceArr[i].caption.from.full_name;
            // imageObj["comments_user_pic"] = sliceArr[i].caption.from.profile_picture;

            // Tags on photo
            // imageObj["tags"] = sliceArr[i].tags;

            imageObj["user_name"] = sliceArr[i].user.username;
            imageObj["user_full_name"] = sliceArr[i].user.full_name;
            imageObj["user_profile_pic"] = sliceArr[i].user.profile_picture;
            imageObj["image_url"] = sliceArr[i]['images'].standard_resolution.url;
            imageObj["created_time"] = new Date(Number(sliceArr[i].created_time) * 1000).toLocaleTimeString();
            imageObj["likes"] = sliceArr[i].likes.count;
            imageObj["link"] = sliceArr[i].link;

            if (sliceArr[i].location != null) {
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
                imageObj["location_name"] = sliceArr[i].location.name;

                cleanData.sort(function(a, b){
                    return a.distance - b.distance;
                });
            }

            cleanData.push(imageObj);

        }


        // Call the loadHtml() function to take the data from Instagram & render it in the Html for the user to see
        loadHtml();
    }


    // Ajax function to pull data from the logged in user's Instagram Account
    function getData() {
        $.ajax({
            type: 'GET',
            url: "https://api.instagram.com/v1/users/self/feed?access_token=" + usertoken,
            dataType: 'jsonp',
            success: function(json) {
                dataArr = json.data;
                console.log(dataArr);
                sliceData(dataArr);
            }
        });
    }


    // Success function that will be called if the broswer is able to access the native geolocation functionality
    // navigator.geolocation.getCurrentPosition(success, error);
    function success(position) {
        latitude = Number(position.coords.latitude);
        longitude = Number(position.coords.longitude);

        /* After successfully loading the latitude & longitude from
        the users location, we execute the getData() function that will
        make an Ajax call to Instagram & retrieve the current users data */
        getData();
    }


    // Error function that will be called if the browser does not have geolocation capabilities & is not supported
    function error(msg) {
        console.log(msg);
    }



    // If-else statement to ask permission to the user if the app can access their current geolocation coordinates & also see if the functionality exists in the current browser
    if (navigator.geolocation) {
        console.log("Geolocation found, getting coordinates now...");
        navigator.geolocation.getCurrentPosition(success, error);
        urlarray = window.location.hash.split("=");
        usertoken = urlarray[1];
    } else {
        console.log("Geolocation not found, please try again!");
        error("not supported");
    }




    $("span.span-realname").on('click', function(){
        $(".span-realname").css("display", "none");
        $(".span-username").css('display', 'block');
    });

});
