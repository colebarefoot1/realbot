var FacebookService = require('../services/FacebookService');
var subscribersSrvc = require('../data-services/subscribers');
var PaymentStripe = require('../../config/payment'); //setup payment
var ApiService = require('../services/ApiService');

exports.userconfirm = (req, res) => {
    var body = req.body;
    var userData = req.user;
    console.log("session", req.session.isnew);
    if (!req.session.isnew) {
        if (userData.subscriber.reg_complete) {
            res.redirect('/dashboard');
            return;
        }
        else if (userData.subscriber.reg_status && userData.subscriber.reg_status != "userconfirm") {
            res.redirect('/' + userData.subscriber.reg_status);
            return;
        }

    }

    if (body && body.botname) {
        subscribersSrvc.getSubscriber({ _id: req.user._id })
            .then(result => {
                result.subscriber.botname = body.botname;
                result.subscriber.phone_number = body.phone_number;
                result.facebook.first_name = body.first_name;
                result.facebook.last_name = body.last_name;
                result.facebook.email = body.email;

                /*
                 var paymentidCB = PaymentStripe.createCustomer (result.facebook.email,result.facebook.name,"7045555555",
                                                                   function(paymentID){
                                                                     return (paymentID);
                                                                 });
                                                                 */
                PaymentStripe
                    .createCustomer(result.facebook.email, result.facebook.name, result.subscriber.phone_number ? result.subscriber.phone_number : "") //pass in the subscriber info
                    .then(stripeID => {        //Getting back the account number from Stripe
                        console.log("stripe ID----->", stripeID.id);
                        result.billing.stripeID = stripeID.id;
                        subscribersSrvc.saveSubscriber(result);
                        var user = result;
                        req.login(user, function (error) {
                            if (!error) {
                                console.log('successfully updated user');
                                userData = user;

                                res.redirect('/brokerconfirm');
                            }
                        });
                        res.end(); // important to update session
                    });




            })
            .catch(ex => {
                console.log(ex);
            })

    } else {
        res.render('userconfirm.ejs', {
            user: userData
        });
    }

};


exports.brokerconfirm = (req, res) => {

    var body = req.body;
    var userData = req.user;

    console.log("userData", userData);
    console.log("body", body);
    if (body && body.broker_email) {
        console.log('moredetail');
        console.info(body);
        subscribersSrvc.getSubscriber({ _id: req.user._id })
            .then(result => {
                console.log('brokerconfirm');
                result.broker.first_name = body.broker_first_name;
                result.broker.last_name = body.broker_last_name;
                result.broker.email = body.broker_email;
                result.broker.phone_number = body.broker_phone_number;
                result.broker.address = body.broker_address;
                result.broker.city = body.broker_city;
                result.broker.state = body.broker_state;
                result.broker.zip = body.broker_zip;
                result.broker.brokerage_name = body.brokerage_name;
                result.subscriber.reg_status = "moredetail";
                subscribersSrvc.saveSubscriber(result);
                var user = result;
                req.login(user, function (error) {
                    if (!error) {
                        console.log('successfully updated user broker');
                        userData = user;
                        res.redirect('/moredetail');
                    }
                });
                res.end(); // important to update session
            })
            .catch(ex => {
                console.log(ex);
            })

    } else {
        res.render('brokerconfirm.ejs', {
            user: userData
        });
    }

};


exports.postactivity = (req, res) => {
    console.log('postactivity');
    console.log(req.body);
    var body = req.body;
    var jActivityData = {
        activity: {
            showing: {
                mlsId: body.mlsId,
                address: body.propertyAddress
            },
            ContactRequest: {
                name: body.name,
                phone: body.phoneNum,
                message: body.message,
                preferredmethod: body.preferredmethod
            }
        }
    };

    ApiService.postActivityData(jActivityData)
        .then(mlsinfo => {
            //Send the JSON data as an object!
            // console.log("postactivity_result", mlsinfo);

            res.set('Access-Control-Allow-Origin', '*');
            res.status(200).json({
                message: 'Thank You',
                mlsinfo: mlsinfo
            });

        }).catch(ex => {
            // console.log(ex);
        })
};



exports.moredetail = (req, res) => {

    var body = req.body;
    var userData = req.user;

    if (body && body.mls_system) {
        subscribersSrvc.getSubscriber({ _id: req.user._id })
            .then(result => {
                console.log('moredetail');
                console.info(result);
                console.info(body);
                result.subscriber.mls_system = body.mls_system;
                result.subscriber.mls_id = body.mls_id;
                result.subscriber.vendor_id = body.vendor_id;
                result.facebook.page_url = body.page_url;
                result.subscriber.agent_id = body.mls_id;
                result.subscriber.reg_status = "dashboard";
                result.subscriber.reg_complete = true;


                subscribersSrvc.saveSubscriber(result);

                ApiService.triggerPaperwork(result.subscriber.mls_system,
                    result.broker.first_name + " " + result.broker.last_name,
                    result.broker.address,
                    result.broker.city,
                    result.broker.zip,
                    result.broker.email,
                    result.facebook.first_name + " " + result.facebook.last_name,
                    result.facebook.email)
                    .then(data => {
                        console.log("triggerPaperwork result", data);

                    }).catch(ex => {
                        console.log("triggerPaperwork error", ex);
                    });

                var user = result;
                req.session.isnew = false;
                req.login(user, function (error) {
                    if (!error) {
                        console.log('successfully updated user');
                        userData = user;
                        //Call broker api

                        console.log(user);
                        if (result.subscriber.status === 'true' && result.subscriber.doc_complete === 'true')
                            res.redirect('/dashboard');
                        else
                            res.redirect('/congratulation');
                    }
                });
                res.end(); // important to update session
            })
            .catch(ex => {
                console.log(ex);
            })

    } else {
        ApiService.getServiceInfo('MLS')
            .then(result => {
                console.log("mls_system_list", result);
                userData.mls_system_list = result;
                res.render('moredetail.ejs', {
                    user: userData
                });
            }).catch(ex => {
                userData.mls_system_list = [];
                res.render('moredetail.ejs', {
                    user: userData
                });
            })

    }

};

exports.congratulation = (req, res) => {

    res.render('congratulation.ejs');
}

exports.subconfig = (req, res) => {
    var body = req.body;
    var userData = req.user;
    FacebookService.getAccountPages(req.user.facebook.token)
        .then(data => {
            //console.log("pages", data);
            console.log('subconfig');
            console.info(data);
            if (body && body.botname) {
                subscribersSrvc.getSubscriber({ _id: req.user._id })
                    .then(result => {
                        result.subscriber.botname = body.botname;
                        result.subscriber.mls_system = body.mls_system;
                        result.subscriber.vendor_id = body.vendor_id;
                        result.subscriber.agent_id = body.agent_id;
                        result.subscriber.phone_number = body.phone_number;
                        result.broker.first_name = body.broker_first_name;
                        result.broker.last_name = body.broker_last_name;
                        result.broker.address = body.broker_address;
                        result.broker.city = body.broker_city;
                        result.broker.state = body.broker_state;
                        result.broker.zip = body.broker_zip;

                        var pages = body.checkboxList;
                        var pagesForDB = [];

                        data.map(pageData => {
                            var selectedPage;
                            for (let pId in pages) {
                                let pageId = pages[pId];
                                if (pageId == pageData.id) {
                                    selectedPage = pageData;
                                }
                            }
                            var pDB;
                            if (selectedPage) {
                                pDB = {
                                    pageId: selectedPage.id,
                                    pageName: selectedPage.name,
                                    pageChecked: true,
                                    pageAccesstoken: selectedPage.access_token
                                }
                                console.log("Selected Page", selectedPage)
                                console.log("pDB output", pDB)
                                FacebookService.addApptoPage(selectedPage.access_token, selectedPage.id)
                                    .then(result => {
                                        console.log("add app to page", result);
                                    })
                                    .catch(ex => {
                                        console.log("add app to page error", ex);
                                    })
                            } else {
                                pDB = {
                                    pageId: pageData.id,
                                    pageName: pageData.name,
                                    pageChecked: false,
                                    pageAccesstoken: pageData.access_token
                                }
                                console.log("pDB output else", pDB)
                                FacebookService.deleteAppFromPage(pageData.access_token, pageData.id)
                                    .then(result => {
                                        console.log("delete app from page", result);
                                    })
                                    .catch(ex => {
                                        console.log("delete app from page error", ex);
                                    })
                            }
                            pagesForDB.push(pDB);

                        })
                        result.pages = pagesForDB;
                        result.subscriber.reg_status = "dashboard";
                        result.subscriber.reg_complete = true;
                        subscribersSrvc.saveSubscriber(result);

                        var user = result;
                        req.login(user, function (error) {
                            if (!error) {
                                console.log('succcessfully updated user');
                                userData = user;
                                res.redirect('/dashboard');
                            }
                        });
                        res.end(); // important to update session
                    })
                    .catch(ex => {
                        console.log(ex);
                    })

            } else {
                let userPages = userData.pages;
                var pages = data.map(page => {
                    for (let pageId in userPages) {
                        var userPage = userPages[pageId];
                        if (userPage.pageChecked && userPage.pageId == page.id) {
                            page.pageChecked = true;
                        }
                    }

                    return page;
                })
                console.log("pages-after check", pages);
                res.render('subconfig.ejs', {
                    user: userData,
                    pages: pages
                });
            }

        }).catch(ex => {
            res.render('subconfig.ejs', {
                user: req.user,
                pages: []
            });
        })
};


