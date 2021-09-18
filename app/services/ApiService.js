'use strict';
const request = require('request-promise')

var ApiService = {



  /*===============================================================================
  getAllUsers Function - pass in SUBSCRIBER fbid returns array of users from api
  =================================================================================
  */

  getAllUsers: (sub_fbid) => {
    return new Promise((resolve, reject) => {
      //Setup and get REST data


      request({
        url: 'https://prod-realtorbot-api.azurewebsites.net/api/authenticate',
        method: 'POST',
        auth: {
          user: 'realbotapikey-dev',
          pass: 'D65s6d@f7sdDFM$DFlwpwf87asdfwe!%$#'
        },
        form: {
          'grant_type': 'client_credentials'
        }
      }, function (err, res) {
        var authResponse = JSON.parse(res.body);
        var token = authResponse.token;
        console.log('getAllUsers');
        console.info(res.body);
        request({
          url: 'https://prod-realtorbot-api.azurewebsites.net/api/users/' + sub_fbid,
          method: 'GET',
          headers: {
            'x-access-token': token
          }

        }, function (err, userData) {
          resolve(JSON.parse(userData.body));
        });

      });

    }
    )
  }, //end of getSubscribers Function;

  /*===============================================================================
  getServiceInfo (MLS) Function - pass in Service CLass returns array of services from api
  =================================================================================
  */

  getServiceInfo: (class_search) => {
    return new Promise((resolve, reject) => {
      //Setup and get REST data


      request({
        url: 'https://prod-realtorbot-api.azurewebsites.net/api/authenticate',
        method: 'POST',
        auth: {
          user: 'realbotapikey-dev',
          pass: 'D65s6d@f7sdDFM$DFlwpwf87asdfwe!%$#'
        },
        form: {
          'grant_type': 'client_credentials'
        }
      }, function (err, res) {
        var authResponse = JSON.parse(res.body);
        var token = authResponse.token;
        console.info('getServiceInfo');
        console.info(res.body);
        request({
          url: 'https://prod-realtorbot-api.azurewebsites.net/api/services/' + class_search,
          method: 'GET',
          headers: {
            'x-access-token': token
          }

        }, function (err, userData) {
          resolve(JSON.parse(userData.body));
        });

      });

    }
    )
  },  //end of getServiceInfo Function;


  /*===============================================================================
   triggerPaperwork - triggers DocuSign Envelope 
  =================================================================================
  */
  triggerPaperwork: (BICMLS, BICName, BICAddress, BICCity, BICZip, BICEmail, RealtorName, RealtorEmail) => {
    return new Promise((resolve, reject) => {
      //Setup the url call and send body


      request.post({
        url: 'https://prod-14.eastus2.logic.azure.com:443/workflows/5871ee44880c44c9849bd568cc322bd6/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2LXNjCxselOG5BYK7tteSsNT1GJthRCt4xedu2f8X3E',
        form: {
          "BICMLS": BICMLS,
          "BIC Name": BICName,
          "BIC Address": BICAddress,
          "BIC City": BICCity,
          "BIC Zip": BICZip,
          "BIC Email": BICEmail,
          "Realtor Name": RealtorName,
          "Realtor Email": RealtorEmail
        },
        headers: {
          'Content-Type': 'application/json'

        }
      }, function (error, response, body) {
        console.log('triggerPaperWork');
        console.info(body);
        resolve(error); //should return 202 Accepted.
      });



    }
    )
  }, //end of triggerPaperwork Function;

  /*===============================================================================
 getSubscribers Function - pass in fbid returns array of subscribers from api
 =================================================================================
 */

  getAllSubArray: (fbid) => {
    return new Promise((resolve, reject) => {
      //Setup and get REST data


      request({
        url: 'https://prod-realtorbot-api.azurewebsites.net/api/authenticate',
        method: 'POST',
        auth: {
          user: 'realbotapikey',
          pass: 'piwj9e*D1asdf@#esdf#134'
        },
        form: {
          'grant_type': 'client_credentials'
        }
      }, function (err, res) {
        var authResponse = JSON.parse(res.body);
        var token = authResponse.token;

        request({
          url: 'https://prod-realtorbot-api.azurewebsites.net/api/subscriber/find/pgid/' + fbid,
          method: 'GET',
          headers: {
            'x-access-token': token
          }

        }, function (err, subscriberData) {
          resolve(subscriberData.body);
        });

      });

    }
    )
  }, //end of getSubscribers Function;

  postActivityData: (jActivityData) => {
    return new Promise((resolve, reject) => {
      //Setup and get REST data
      request({
        
        // url: 'https://prod-realtorbot-api.azurewebsites.net/api/authenticate',
        url:'http://dev-realbot-api.azurewebsites.net/api/authenticate',
        //url: process.env.RealBotAPIEndURI + 'api/authenticate',
        method: 'POST',
        auth: {
          user: process.env.RealBotAPIUsername,
          pass: process.env.RealBotAPIKey
        },
        form: {
          'grant_type': 'client_credentials'
        }
      }, function (err, res) {
        console.log(res.body);

        var authResponse = JSON.parse(res.body);
        var token = authResponse.token;

        console.log('***************REALBOTAPI TOKEN************');
        console.log(token);

        request({
          // url: 'https://prod-realtorbot-api.azurewebsites.net/api/activity/',
          url:'http://dev-realbot-api.azurewebsites.net/api/activity/',
          //url: process.env.RealBotAPIEndURI + 'api/activity/',
          method: 'POST',
          form: jActivityData,
          headers: {
            'x-access-token': token,
          }
        }, function (err, response) {
          resolve(response);
        });
        console.log("Data Sent to PostUserData function", jActivityData);
      });
    }
    )
  }, //end of create activity Function;

  //Matt - don't forget the comma at the end of second to last function or to move the end of file (below)
};

module.exports = ApiService;
