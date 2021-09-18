/*
 * RealBot Java Script Library
 * the Steve and Matt company
 */
var btoa = require('btoa')
// There are your API Credentials - they get base64 encoded
var auth = btoa("simplyrets:simplyrets");

module.exports = {}
function getResults() {
    $.ajax({
        // make an AJAX request - this is the /properties endpoint
        url: "https://api.simplyrets.com/properties",
        type: 'GET',
        dataType: 'json',
        // authorize with the API credentials
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Basic  " + auth);
        },
        success: function(res) {
            // res is the set of listings returned from the API
            return (res);
        }
    });
}

/*
function getProperties() {
    var userName = "simplyrets"
    var subscriptionKey = "simplyrets";
    var personGroup = "persongroup1";
    var query = document.getElementById("query").value;
        $(function() {
            var params = {  
                // Request parameters
            };
          
            $.ajax({
                url: 'https://@api.simplyrets.com/properties?count=true&q=' + query + $.param(params),
                beforeSend: function(xhrObj){
                    // Request headers
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Authorization", "Basic " + btoa(userName + ":" + subscriptionKey));
                   
                },
                type: "GET",
                dataType: "json",
                // Request body
                //data: "{body}",
            })
            .done(function(data) {
                //console.log(JSONdata);
                //console.log(data);
                console.log ("Number of properties returned:" + data.length);
                for(var i=0; i < data.length; i++) {
                    $("#getPropertiesZip").append(data[i].address.full + "</br>");
                }    
            })
            .fail(function() {
                //alert("error");
            });
        });
    } //getProperties end bracket

*/
    /*
    function getResults() {
        $.ajax({
            // make an AJAX request - this is the /properties endpoint
            url: "https://api.simplyrets.com/properties",
            type: 'GET',
            dataType: 'json',
            // authorize with the API credentials
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Basic  " + auth);
            },
            success: function(res) {
                // res is the set of listings returned from the API
                // loop through them and print the address
                for(var i=0; i < res.length; i++) {
                    $("#app").append("<p>" + res[i].address.full + "</p>");
                    $("#app").append("<p>" + res[i].address.city +"," + res[i].address.state + "," + res[i].address.postalCode + "</p>");
                    
                    
                    JSONphotoURL = JSON.stringify(res[i].photos)
                    var splitPhotoURL = JSONphotoURL.split(",");
                    for (var m = 0; m < splitPhotoURL.length; m++) {
                        var pushedPhotoURL = splitPhotoURL[m];
                        var cleanedPhotoURL = pushedPhotoURL.replace('[','').replace(']','');  //chained replace;  removes [ and ]  from string
                        $("#photos").append(cleanedPhotoURL);
                        //$("#app").append("<p>" + cleanedPhotoURL + "</p>");
                        //$("#photos").append('<div class="carousel-item"> <img class="d-block w-100" src="' + cleanedPhotoURL+'></div>');
                        console.log("here is the text" + cleanedPhotoURL);
                    }
                    
                }
            }
        });
    }

    */