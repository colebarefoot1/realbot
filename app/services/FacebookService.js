'use strict';
var FB = require('fb');

var FacebookService = {
  getPicture: (accessToken,id)=> new Promise((resolve, reject) => {
    console.log("Accesstoken", accessToken);
      FB.setAccessToken(accessToken);
      FB.api(`/${id}/picture`, function (res) {
          if(!res || res.error) {
            reject(res.error);
          }
          resolve(res.data);
          });
      } 
  ),
  getAccountPages: (accessToken)=> new Promise((resolve, reject) => {
    console.log("Accesstoken", accessToken);
    FB.setAccessToken(accessToken);
    FB.api('/me/accounts', function(res){
          if(!res || res.error) {
            reject(res.error);
          }
        
              resolve(res.data);
           })
    } 
  ),

  deleteAppFromPage: (pageAccessToken, myPageID)=> new Promise((resolve, reject) => {
    FB.setAccessToken(pageAccessToken);
    console.log("My page ID", myPageID);
    FB.api(
     `/${myPageID}/subscribed_apps`,
     'DELETE',
     {"access_token": `${pageAccessToken}`},
        function(res) {
          console.log(res);
           if(!res || res.error) {
            reject(res.error);
           }
      
           resolve(res);
        })
       }
  ),
  addApptoPage: (pageAccessToken, myPageID)=> new Promise((resolve, reject) => {
    FB.setAccessToken(pageAccessToken);
    console.log("My page ID", myPageID);
    FB.api(
     `/${myPageID}/subscribed_apps`,
     'POST',
     {"access_token": `${pageAccessToken}`},
        function(res) {
          console.log(res);
           if(!res || res.error) {
            reject(res.error);
           }
      
           resolve(res);
        })
       }
  )

};

module.exports = FacebookService;
