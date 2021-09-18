
var express = require('express')
// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_Yma8zrwzsSAvIfUxSdut8QGO");


var app = express();

module.exports = {
  createCustomer: (fbemail, name, phone)=> {
    return new Promise((resolve, reject) => {
  console.log("data sent to createCustomer - fbemail", fbemail)
  console.log("data sent to createCustomer - phone", phone)
  console.log("data sent to createCustomer - name", name)
  
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  var stripe = require("stripe")("sk_test_Yma8zrwzsSAvIfUxSdut8QGO");
    const customer = stripe.customers.create({
      email: fbemail,
      description: name + ' ' + phone
      //Phone: phone  //???? Unknown praramter phone??? WTF
      
    }, function(err, stripeID) {
       //Add created customer to plan  
       console.log('string stripe id -------------------->',stripeID.id)
       const subscription = stripe.subscriptions.create({
       
        customer: stripeID.id,
        items: [{plan: 'basic-monthly'}]
        });
      resolve(stripeID);
    })
    
  });
  
 },//end of createCustomer


};
 
