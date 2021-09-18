window.fbAsyncInit = function() {
    FB.init({
      appId            : '1874065009571106',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v2.11'
    });
  };

  
     F(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));            
 
 function login(){
   FB.login(function(response) {
      // handle the response
      }, {scope: 'public_profile,email,publish_pages,pages_messaging_subscriptions,manage_pages,pages_show_list'});
      //need to add to scope after reivew from Facebook: publish_pages,pages_messaging_subscriptions,manage_pages, page_show_list
      getFBLoginStatus()
 }

 function logout() {
  window.location.replace('index.html');

  FB.logout(function(response) {
    // user is now logged out


   });
 }

 function getFBLoginStatus(){
   
   FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
    // the user is logged in and has authenticated your
    // app, and response.authResponse supplies
    // the user's ID, a valid access token, a signed
    // request, and the time the access token 
    // and signed request each expire
    var uid = response.authResponse.userID;
    console.log('UserID: '+ uid);
    
    var accessToken = response.authResponse.accessToken;
    console.log('AccessToken: '+ accessToken);
    
    var emailAddr = JSON.stringify(response.user-id.email);
    console.log('Email Addr: '+ emailAddr);
    
    sendtoFeeBDb(uid, accessToken, emailAddr);
  } else if (response.status === 'not_authorized') {
    // the user is logged in to Facebook, 
    // but has not authenticated your app
    console.log('Not Authorized')
  } else {
    // the user isn't logged in to Facebook.
    console.log('Not Logged In')
  }
 });  //removed },true paramerter to refresh from local cache; otherwise response.authResponse will be from cache
 
 } //end of getFBLoginStatus()
 
 
 function getUserInfo(){
   FB.api(function(response) {
      if (response.status === 'connected') {
        var accessToken = response.authResponse.accessToken;
        console.log("accesstoken",accessToken)
        FB.api('/me/', function(response){
          // loop through them and print pages
            //for(var i=0; i < response.length; i++) {
                $("#app1").append("<p>" + response.email + "</p>");
                console.log("email:" + response.email)
           // }

         })
      } 
   });
   
 } //getUserInfo() end of function
 
 
 function managePages(){
   FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        var accessToken = response.authResponse.accessToken;
        FB.api('/me/accounts', function(response){
          // loop through them and print pages
            for(var i=0; i < response.data.length; i++) {
                //$("#app").append("<p>" + response.data[i].name + "</p>" + "<button id=" + '"' + response.data[i].id + '"' + ">" + "manage" + "</button>" + "<br>");
                $("#app").append('<li class="list-group-item">' + response.data[i].name + "</p>" + "<button id=" + '"' + response.data[i].id + '"' + "onclick = addApptoPage(" + response.data[i].access_token + ',' + response.data[i].id +') class="btn btn-lg">' + "manage" + "</li>");

            }
         })
      } 
   });

 } //managePages end of function
 
 
 
 
 function sendtoFeeBDb(fbid, accesstoken, email){
   console.log("function sendtofeebdb() received:" + fbid + accesstoken + email);
   
 } //sendtoFeeBDb end of function


 function addApptoPage(pageAccessToken, myPageID){
 FB.api(
  `/${myPageID}/subscribed_apps`,
  'POST',
  {"access_token": `${pageAccessToken}`},
  function(response) {
     console.log("response from fB:", response)
    }
  );
}//addApptoPage() end of function

