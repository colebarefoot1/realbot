//Each function uses RestAPI call to realbotdb api
//
//Date 4/11/2018 MDD

//Load Environment variables from file if not Production
if (process.env.CALLBACKURI !== 'prod') {
  require('dotenv').load();
}
// set up ======================================================================
// get all the tools we need


var request = require('request');


module.exports = {

/*===============================================================================
getDataSimplyRets Function - retrieves data from SimplyRets API MLS Service
=================================================================================
*/
getDataSimplyRets: (mls) => {
  return new Promise((resolve, reject) => {
//Setup and get REST data


request({
  url: process.env.RETSBaseURI + '/properties/' + mls,
  method: 'get',
  auth: {
    user: process.env.RETSUsername,
    pass: process.env.RETSPassword
  },
  headers: {
    authorization: 'Basic'
  }
}, function(err, propertyData) {
                  resolve(propertyData.body);
      });



}
)} //end of getDataSimplyRets Function;

//Matt - don't forget the comma at the end of second to last function or to move the end of file (below)

}; //end of file