//Triggers DocuSign
//
//Date 6/6/2018 MDD
//Load Environment variables from file if not Production
if (process.env.CALLBACKURI !== 'prod') {
    require('dotenv').load();
  // set up ======================================================================
  // get all the tools we need
  
  }
  var request = require('request');
  
  
  module.exports = {
  
  /*===============================================================================
   triggerPaperwork - triggers DocuSign Envelope 
  =================================================================================
  */
 triggerPaperwork: (BICMLS, BICName, BicAddress, BICCity, BicZip, BicEmail, RealtorName, RealtorEmail) => {
    return new Promise((resolve, reject) => {
  //Setup the url call and send body
  
  
  request({
    url: 'https://prod-14.eastus2.logic.azure.com:443/workflows/5871ee44880c44c9849bd568cc322bd6/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2LXNjCxselOG5BYK7tteSsNT1GJthRCt4xedu2f8X3E',
    method: 'get',
    body:{
        "BICMLS": BICMLS,
        "BIC Name": BICName,
        "BIC Address": BICAddress,
        "BIC City" : BICCity,
        "BIC Zip" : BICZip,
        "BIC Email" : BICEmail,
        "Realtor Name" : RealtorName,
        "Realtor Email" : RealtorEmail
    },
    headers: {
        'Content-Type': 'application/json'
      
    }
  }, function(err) {
                    resolve(err); //should return 202 Accepted.
        });
  
  
  
  }
  )} //end of triggerPaperwork Function;
  
  //Matt - don't forget the comma at the end of second to last function or to move the end of file (below)
  
  }; //end of file