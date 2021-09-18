var simplyRETS = require('../config/simplyrets.js');
var UserController = require('./controllers/UserController.js');
var DashboardController = require('./controllers/DashboardController.js');
var ApiService = require('./services/ApiService.js');

module.exports = function(app, passport) {

// normal routes ===============================================================
    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // display the results of a specific home testMLS ID 1005252
    app.get('/results/:mlsID/:pageID/:userID', function(req, res) {
        console.log('mlsID = ' + req.param('mlsID'));
        simplyRETS
            .getDataSimplyRets(req.param('mlsID'))
            .then(mlsinfo => {        //pulls the json array from the SIMPLYRETS API
                console.log("getDataSimplyRets result:",mlsinfo);
                var jsonMLS = JSON.parse(mlsinfo);

               
                //var nf = Intl.NumberFormat();  //variable nf = number format
                // Create our number formatter.
                var formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    });
                          
                ApiService
                    .getAllSubArray(req.param('pageID'))  
                    .then(subscriber => {
                        //console.log("jsonMLS:", jsonMLS.geo.lat)
                        var jsonSubscriber = JSON.parse(subscriber)
                        console.log("subscriber info",jsonSubscriber);
                        phoneUFormat = jsonSubscriber[0].subscriber.phone_number;
                        var phoneformat = phoneUFormat.substr(0, 3) + '-' + phoneUFormat.substr(3, 3) + '-' + phoneUFormat.substr(6,4);
                        res.render('results2.ejs', {
                            user_Id: req.param('userID'),
                            pageID:req.param('pageID'),
                            brokerage_brokerageName: 'Wilson Reality',
                            sub_agentPhoneNum: phoneformat,
                            fb_sub_agentfname: jsonSubscriber[0].facebook.first_name,
                            fb_sub_agentlname: jsonSubscriber[0].facebook.last_name,
                            fb_sub_email: jsonSubscriber[0].facebook.email,
                            listPrice: formatter.format(jsonMLS.listPrice),
                            photos: jsonMLS.photos,
                            //listPrice: nf.format(jsonMLS.listPrice),
                            crossStreet: jsonMLS.address.crossStreet,
                            state: jsonMLS.address.state,
                            country: jsonMLS.address.country,
                            postalCode: jsonMLS.address.postalCode,
                            streetName: jsonMLS.address.streetName,
                            streetNumberText: jsonMLS.address.streetNumberText,
                            city: jsonMLS.address.city,
                            streetNumber: jsonMLS.address.streetNumber,
                            full: jsonMLS.address.full,
                            remarks: jsonMLS.remarks,
                            disclaimer: 'CarolinasMLS Data Refresh as of: 5/10/2018 @ 15:01 EST.  All data rights to Carolinas MLS.',
                            privateRemarks: jsonMLS.privateRemarks,
                            roof: jsonMLS.property.roof,
                            cooling: jsonMLS.property.cooling,
                            style: jsonMLS.property.style,
                            property_area: jsonMLS.property.area,
                            bathsFull: jsonMLS.property.bathsFull,
                            bathsHalf: jsonMLS.property.bathsHalf,
                            stories: jsonMLS.property.stories,
                            fireplaces: jsonMLS.property.fireplaces,
                            flooring: jsonMLS.property.flooring,                               
                            heating: jsonMLS.property.heating,
                            foundation: jsonMLS.property.foundation,
                            poolFeatures: jsonMLS.property.poolFeatures,
                            laundryFeatures: jsonMLS.property.laundryFeatures,
                            occupantName: jsonMLS.property.occupantName,
                            ownerName: jsonMLS.property.ownerName,
                            lotDescription: jsonMLS.property.lotDescription,
                            lotSizeAcres: jsonMLS.property.lotSizeAcres,
                            subType: jsonMLS.property.subType,
                            bedrooms: jsonMLS.property.bedrooms,
                            interiorFeatures: jsonMLS.property.interiorFeatures,
                            lotSize: jsonMLS.property.lotSize,
                            areaSource: jsonMLS.property.areaSource,
                            maintenanceExpense: jsonMLS.property.maintenanceExpense,
                            additionalRooms: jsonMLS.property.additionalRooms,
                            exteriorFeatures: jsonMLS.property.exteriorFeatures,
                            water: jsonMLS.property.water,
                            view: jsonMLS.property.view,
                            lotSizeArea: jsonMLS.property.lotSizeArea,
                            subdivision: jsonMLS.property.subdivision,
                            construction: jsonMLS.property.construction,
                            subTypeRaw: jsonMLS.property.subTypeRaw,
                            leased: jsonMLS.property.parking.leased,
                            spaces: jsonMLS.property.parking.spaces,
                            description: jsonMLS.property.parking.description,
                            lotSizeAreaUnits: jsonMLS.property.lotSizeAreaUnits,
                            type: jsonMLS.property.type,
                            garageSpaces: jsonMLS.property.garageSpaces,
                            bathsThreeQuarter: jsonMLS.property.bathsThreeQuarter,
                            accessibility: jsonMLS.property.accessibility,
                            occupantType: jsonMLS.property.occupantType,
                            yearBuilt: jsonMLS.property.yearBuilt,
                            mlsId: jsonMLS.mlsId,
                            
                            //showingInstructions: jsonMLS.showingInstructions,
                            //email: jsonMLS.office.contact.email,
                            // office_phone_num: jsonMLS.office.contact.office,
                            // office_name: jsonMLS.office.name,
                            //cell: jsonMLS.office.contact.cell,
                            servingName: jsonMLS.office.servingName,
                            office_brokerid: jsonMLS.office.brokerid,
                            leaseTerm: jsonMLS.leaseTerm,
                            disclaimer: jsonMLS.disclaimer,
                            crossStreet: jsonMLS.address.crossStreet,
                            state: jsonMLS.address.state,
                            country: jsonMLS.address.country,
                            postalCode: jsonMLS.address.postalCode,
                            streetName: jsonMLS.address.streetName,
                            streetNumberText: jsonMLS.address.streetNumberText,
                            city: jsonMLS.address.city,
                            streetNumber: jsonMLS.address.streetNumber,
                            full: jsonMLS.address.full,
                            listDate: jsonMLS.listDate,
                            agent_lastname: jsonMLS.agent.lastName,
                            //email: jsonMLS.agent.contact.email,
                            //cell: jsonMLS.agent.contact.cell,
                            agent_firstname: jsonMLS.agent.firstName,
                            id: jsonMLS.agent.id,
                            modified: jsonMLS.modified,
                            middleSchool: jsonMLS.school.middleSchool,
                            highSchool: jsonMLS.school.highSchool,
                            elementarySchool: jsonMLS.school.elementarySchool,
                            district: jsonMLS.school.district,
                            
                            listingId: jsonMLS.listingId,
                            status: jsonMLS.mls.status,
                            area: jsonMLS.mls.area,
                            daysOnMarket: jsonMLS.mls.daysOnMarket,
                            originatingSystemName: jsonMLS.mls.originatingSystemName,
                            statusText: jsonMLS.mls.statusText,
                            areaMinor: jsonMLS.mls.areaMinor,
                            county: jsonMLS.geo.county,
                            lat: jsonMLS.geo.lat,
                            lng: jsonMLS.geo.lng,
                            marketArea: jsonMLS.geo.marketArea,
                            directions: jsonMLS.geo.directions,
                            taxYear: jsonMLS.tax.taxYear,
                            taxAnnualAmount: jsonMLS.tax.taxAnnualAmount,
                            //id: jsonMLS.tax.id,
                            //coagentlastName: jsonMLS.coAgent.lastName,
                            //email: jsonMLS.coAgent.contact.email,
                            //office: jsonMLS.coAgent.contact.office,
                            //cell: jsonMLS.coAgent.contact.cell,
                            //coagentfirstName: jsonMLS.coAgent.firstName,
                            //id: jsonMLS.coAgent.id,
                            //closeDate: jsonMLS.sales.closeDate,
                            //office: jsonMLS.sales.office,
                            //closePrice: jsonMLS.sales.closePrice,
                            //agent: jsonMLS.sales.closePrice.agent,
                            //contractDate: jsonMLS.sales.contractDate,
                            leaseType: jsonMLS.leaseType,
                            virtualTourUrl: jsonMLS.virtualTourUrl,
                            remarks: jsonMLS.remarks,
                            fee: jsonMLS.association.fee,
                            association_name: jsonMLS.association.name,
                            amenities: jsonMLS.association.amenities,
                        });
                    });        
            });
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // SELECT FACEBOOK PAGE SECTION =========================
    app.get('/select', isLoggedIn, function (req, res) {
        res.render('select.ejs', {
            user: req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // USER CONFIRM ===================================
    app.get('/userconfirm', isLoggedIn, UserController.userconfirm);
    app.post('/userconfirm', isLoggedIn, UserController.userconfirm);

    // USER CONFIGRATION ==============================
    app.get('/subconfig', isLoggedIn, UserController.subconfig);
    app.post('/subconfig', isLoggedIn, UserController.subconfig);
    
    // BROKER CONFIRM =================================
    app.get('/brokerconfirm', isLoggedIn, UserController.brokerconfirm);
    app.post('/brokerconfirm', isLoggedIn, UserController.brokerconfirm);

    // MORE DETAIL CONFIRM ============================
    app.get('/moredetail', isLoggedIn, UserController.moredetail);
    app.post('/moredetail', isLoggedIn, UserController.moredetail);

    // app.get('/postactivity', isLoggedIn, UserController.postactivity);
    // app.post('/postactivity', isLoggedIn, UserController.postactivity);

    app.get('/postactivity', UserController.postactivity);
    app.post('/postactivity', UserController.postactivity);
    
    // CONGRATULATION ============================
    app.get('/congratulation', isLoggedIn, UserController.congratulation);
    app.post('/congratulation', isLoggedIn, UserController.congratulation);
    // DASHBOARD ==============================
    app.get('/dashboard', isLoggedIn, DashboardController.index);

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/userconfirm', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/userconfirm', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email','manage_pages','pages_show_list','publish_pages','pages_messaging_subscriptions'] }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/userconfirm',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/userconfirm',
                failureRedirect : '/'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/userconfirm', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : ['public_profile', 'email'] }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/userconfirm',
                failureRedirect : '/'
            }));
        
        // have subscriber choose  Facebook page bot will manage
        app.get('/select',
            passport.authorize('facebook', {
                successRedirect : '/select',
                failureRedirect : '/'
            }));
        

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/userconfirm',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/userconfirm',
                failureRedirect : '/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/userconfirm');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/userconfirm');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/userconfirm');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/userconfirm');
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
