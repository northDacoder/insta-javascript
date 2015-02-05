$(document).ready(function(){


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
                imageObj["location_name"] = sliceArr[i].location.name;
            }

            cleanData.push(imageObj);

        }


        // Call the loadHtml() function to take the data from Instagram & render it in the Html for the user to see
        loadHtml();
    }


    // Ajax function to retrieve the current Users data from the Instagram API
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


    // Function to retrieve the user data from the Instagram API 
    getData();




});
