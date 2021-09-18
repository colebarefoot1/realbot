// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

//define the schema for page
var pageSchema = new mongoose.Schema({
    pageId:String,
    pageName: String,
    pageChecked: {
        type:Number,
        required: true,
        default: false
    },
    pageAccesstoken: String
});

// define the schema for our user model
//changed from userSchema to subscriberSchema
var subscriberSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    },
    facebook                : {
        id                  : String, //facebook user id (fbid)
        token               : String,
        name                : String,
        email               : String,
        user_friends        : String,
        first_name          : String, 
        last_name           : String,
        default_page_id     : String,  //which page the user selected the bot
        all_page_id         : String,   //all page id's for a user
        page_url            : String,
        fb_id_picurl        : String,
        fb_pageid_picurl    : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    billing          : {
        stripeID        : String,
        token        : String
        
    },
    broker           : {
        brokerage_name : String,
        first_name   : String,
        last_name    : String,
        email        : String,
        phone_number : String,
        address      : String,
        city         : String,
        state        : String,
        zip          : String
    },
    subscriber       : {
        botname      : String,
        mls_system   : String,
        mls_id       : String, 
        phone_number : String,
        vendor_id    : String,
        agent_id     : String,
        doc_complete : String,
        status       : String,
        reg_complete : {
            type:Number,
            required: true,
            default: false
        },
        reg_status   : {
            type: String,
            default: "userconfirm"
        }
    },
    pages: [pageSchema]

});

// generating a hash
subscriberSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
subscriberSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
//changed from User to Subscriber
module.exports = mongoose.model('Subscriber', subscriberSchema);
