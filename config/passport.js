// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User       = require('../app/models/subscriber');

var FB = require('fb'),
    fb = new FB.Facebook({
        appId            : '1874065009571106',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v3.0'
      });

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

var PaymentStripe = require('./payment'); //setup payment

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // create the user
                        var newUser            = new User();

                        newUser.local.email    = email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }

                });
            // if the user is logged in but has no local account...
            } else if ( !req.user.local.email ) {
                // ...presumably they're trying to connect a local account
                // BUT let's check if the email used to connect a local account is being used by another user
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    if (err)
                        return done(err);
                    
                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                        // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                    } else {
                        var user = req.user;
                        user.local.email = email;
                        user.local.password = user.generateHash(password);
                        user.save(function (err) {
                            if (err)
                                return done(err);
                            
                            return done(null,user);
                        });
                    }
                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }

        });

    }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    var fbStrategy = configAuth.facebookAuth;
    
    fbStrategy.passReqToCallback = true;  // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    passport.use(new FacebookStrategy(fbStrategy,

    function(req, token, refreshToken, profile, done) {
        
        //we need code here to check if profile/emails[0].value is null then update value
        //this is because fb doesn't require an email, passing undefined in proflie.email and throwing error
        console.log("before if-then")
        if (typeof profile.emails === undefined || typeof profile.emails === 'undefined') {
            userEmailVar = profile.name.givenName + profile.name.familyName + '@undefined.com'
            } else {
                userEmailVar = profile.emails[0].value.toLowerCase();
            }
            
        // asynchronous
            process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        
                        
                        
                        
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        req.session.isnew = false;
                        if (!user.facebook.token) {
                            user.facebook.token = token;
                            user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                            user.facebook.email = userEmailVar; //added userEmailVar to check for undefined from fb
                            user.subscriber.doc_complete = "true";
                            user.subscriber.status = "false"; 
                            
                            


                            user.save(function(err) {
                                if (err)
                                    return done(err);
                                  
                                return done(null, user);
                            });
                        }

                   
                        FB.setAccessToken(user.facebook.token);
                        FB.api(`/${user.facebook.default_page_id}/?fields=picture`, function (res) {
                                    if(!res || res.error) {
                                     console.log(!res ? 'error occurred' : res.error);
                                     return;
                                    }
        
                                    console.log('******************facebook picture***************');
                                    console.log(res);
        
                                    user.facebook.fb_pageid_picurl = res.picture.data.url;
                                    user.save();
                                  });
                                  
                        FB.api(`/${user.facebook.id}/?fields=picture`, function (res) {
                                    if(!res || res.error) {
                                     console.log(!res ? 'error occurred' : res.error);
                                     return;
                                    }
        
                                    console.log('******************facebook picture***************');
                                    user.facebook.fb_id_picurl = res.picture.data.url;
                                    user.save();
                                  });

                        
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        /*
                        This next section added by Matt Diamond
                        Creates user's payment in Stripe
                        */
                       

                        var newUser = new User();

                        
                        /*var paymentidCB = PaymentStripe.createCustomer (newUser.facebook.email,function(paymentID){
                            console.log("inside",paymentID);
                            return (paymentID);
                            });
                        
                        newUser.billing.stripeID = paymentidCB;*/
                        newUser.facebook.id    = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = userEmailVar; //added userEmailVar to check for undefined from fb
                        newUser.facebook.first_name = profile.name.givenName;
                        newUser.facebook.last_name = profile.name.familyName;
                        newUser.facebook.default_page_id = "326895691165413";
                        newUser.facebook.all_page_id = "[]";
                        newUser.subscriber.botname = "Veronica";
                        newUser.subscriber.mls_system = "CAROLINAS_MLS";
                        newUser.subscriber.vendor_id = "umullins";
                        newUser.subscriber.agent_id = "mullins";
                        newUser.subscriber.doc_complete = "true";
                        newUser.subscriber.status = "false";
                        newUser.isnew = true;
                        
                       
                        FB.setAccessToken(newUser.facebook.token);
                        FB.api(`/${newUser.facebook.default_page_id}/?fields=picture`, function (res) {
                                    if(!res || res.error) {
                                     console.log(!res ? 'error occurred' : res.error);
                                     return;
                                    }
        
                                    newUser.facebook.fb_pageid_picurl = res.picture.data.url;
                                    newUser.save();
                                  });
                                  
                        FB.api(`/${newUser.facebook.id}/?fields=picture`, function (res) {
                                    if(!res || res.error) {
                                     console.log(!res ? 'error occurred' : res.error);
                                     return;
                                    }
                                
                                    newUser.facebook.fb_id_picurl = res.picture.data.url;
                                    newUser.save();
                                  });
                        
                        req.session.isnew = true;
                        newUser.save(function(err) {
                            if (err)
                                return done(err);
                                
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session
                console.log("session");
                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = userEmailVar; //added userEmailVar to check for undefined from fb it was user.facebook.email = (profile.emails[0].value || '').toLowerCase();
                user.subscriber.doc_complete = "true";
                user.subscriber.status = "false";                                    
                req.session.isnew = false;

                FB.setAccessToken(user.facebook.token);
                FB.api(`/${user.facebook.default_page_id}/?fields=picture`, function (res) {
                            if(!res || res.error) {
                             console.log(!res ? 'error occurred' : res.error);
                             return;
                            }

                            user.facebook.fb_pageid_picurl = res.picture.data.url;
                            user.save();
                          });
                          
                FB.api(`/${user.facebook.id}/?fields=picture`, function (res) {
                            if(!res || res.error) {
                             console.log(!res ? 'error occurred' : res.error);
                             return;
                            }

                            user.facebook.fb_id_picurl = res.picture.data.url;
                            user.save();
                          });


                user.save(function(err) {
                    if (err)
                        return done(err);
                     
                    return done(null, user);
                });

            }
        });

    }));

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, tokenSecret, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.twitter.token) {
                            user.twitter.token       = token;
                            user.twitter.username    = profile.username;
                            user.twitter.displayName = profile.displayName;

                            user.save(function(err) {
                                if (err)
                                    return done(err);
                                    
                                return done(null, user);
                            });
                        }

                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser                 = new User();

                        newUser.twitter.id          = profile.id;
                        newUser.twitter.token       = token;
                        newUser.twitter.username    = profile.username;
                        newUser.twitter.displayName = profile.displayName;

                        newUser.save(function(err) {
                            if (err)
                                return done(err);
                                
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user                 = req.user; // pull the user out of the session

                user.twitter.id          = profile.id;
                user.twitter.token       = token;
                user.twitter.username    = profile.username;
                user.twitter.displayName = profile.displayName;

                user.save(function(err) {
                    if (err)
                        return done(err);
                        
                    return done(null, user);
                });
            }

        });

    }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.google.token) {
                            user.google.token = token;
                            user.google.name  = profile.displayName;
                            user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                            user.save(function(err) {
                                if (err)
                                    return done(err);
                                    
                                return done(null, user);
                            });
                        }

                        return done(null, user);
                    } else {
                        var newUser          = new User();

                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                        newUser.save(function(err) {
                            if (err)
                                return done(err);
                                
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user               = req.user; // pull the user out of the session

                user.google.id    = profile.id;
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                user.save(function(err) {
                    if (err)
                        return done(err);
                        
                    return done(null, user);
                });

            }

        });

    }));

};
