// config/auth.js

//Load Environment variables from file if not Production
if (process.env.CALLBACKURI !== 'prod') {
    require('dotenv').load();
}

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : process.env.FacebookClientID, // your App ID for FB
        'clientSecret'    : process.env.FacebookAuthID, // your App Secret
        'callbackURL'     : process.env.RealBotFrontEndURI + 'auth/facebook/callback',
        'profileURL'      : 'https://graph.facebook.com/v2.12/me?',
        'profileFields'   : ['id', 'email', 'name'] // For requesting permissions from Facebook API 'publish_pages','pages_messaging_subscriptions,''manage_pages', 'page_show_list','user_friends'

    },

    'twitterAuth' : {
        'consumerKey'        : 'your-consumer-key-here',
        'consumerSecret'     : 'your-client-secret-here',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : 'your-secret-clientID-here',
        'clientSecret'     : 'your-client-secret-here',
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    }

};
