const express = require('express');
const axios = require('axios');


const router = express.Router();
const util = require('../modules/utility');
const seeds = require('../seeds');
const config = require('../config/config');

router.get('/accountant/create', (req, res, next) => {
    if (tempProfile == null && temp.company != undefined) {
        res.redirect('/dashboard');
    } else {
        if (tempProfile.company.profilesCreated == tempProfile.company.accountants.length) {
            res.redirect('/dashboard');
        } else {
            if (tempProfile.company.profilesCreated == 0) {

                tempProfile.company.profilesCreated++;
                res.render('company/accountant/create', {
                    userExists: false,
                    accountant: 'Head',
                    countryCode: utilData.phone_code.ISD,
                    email: tempProfile.headAcc.email,
                    password: tempProfile.headAcc.password
                });
            } else {
                accountant = tempProfile.company.accountants[tempProfile.company.profilesCreated++];

                res.render('company/accountant/create', {
                    accountant: accountant,
                    countryCode: utilData.phone_code.ISD,
                    email: null,
                    password: null
                });
            }
        }
    }
});

router.post('/accountant/create', (req, res, next) => {
    util.authCheck(req, user => {
        if (user) {
            res.redirect('/dashboard');
        } else {

            var accountant = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                countryCode: req.body.countryCode,
                phone: req.body.phone,
                email: req.body.email,
                password: req.body.password,
                address: {
                    address1: req.body.address1,
                    city: req.body.city,
                    state: req.body.state,
                    country: req.body.country,
                    pincode: req.body.pincode,
                },
            };

            var payload = {
                email: accountant.email,
                accessToken: accessToken
            };

            axios.post(config.url + '/auth/accountant/exists/', payload)
                .then(response => {
                    var data = response.data;
                    if (!data.exists) {
                        accountantType = tempProfile.company.accountants[tempProfile.company.profilesCreated - 1];
                        switch (accountantType) {
                            case "Head":
                                tempProfile.headAcc = accountant;
                                break;
                            case "Client":
                                tempProfile.clientAcc = accountant;
                                break;
                            case "Expense":
                                tempProfile.expenseAcc = accountant;
                                break;
                            case "General":
                                tempProfile.generalAcc = accountant;
                        }

                        if (tempProfile.company.profilesCreated == tempProfile.company.accountants.length) {
                            // Everything completed
                            // make axios request to save everything
                            var payload = {
                                company: tempProfile,
                                accessToken: accessToken
                            };
                            axios.post(config.url + '/auth/signup/', payload)
                                .then(response => {
                                    var data = response.data;
                                    const user = {
                                        name: tempProfile.headAcc.firstName.substring(0, 1) + '. ' + tempProfile.headAcc.lastName,
                                        email: tempProfile.headAcc.email,
                                        company: tempProfile.company,
                                        token: data.token
                                    };
                                    console.log('User created: ');
                                    console.log('user token: ', user.token);
                                    res.cookie('user', user, cookieOpt);
                                    tempProfile = null;
                                    res.redirect('/dashboard');
                                })
                                .catch(error => {
                                    console.error(error);
                                    res.render('error', {
                                        message: dbErrorMsg
                                    });
                                });

                        } else {
                            res.redirect('/company/accountant/create');
                        }

                    } else {
                        accountantType = tempProfile.company.accountants[tempProfile.company.profilesCreated - 1];
                        res.render('company/accountant/create', {
                            userExists: true,
                            accountant: accountantType,
                            countryCode: utilData.phone_code.ISD,
                            email: tempProfile.headAcc.email,
                            password: tempProfile.headAcc.password
                        });
                    }
                })
                .catch(error => {
                    console.error(error);
                    res.render('error', {
                        message: dbErrorMsg
                    });
                });
        }
    });
});

router.get('/accountant/edit', (req, res) => {
    util.authCheck(req, user => {
        if (user) {
            axios.post(config.url + '/auth/accountant/fetch/', {
                accessToken,
                token: user.token
            }).then(response => {
                const data = response.data;
                res.render('company/accountant/edit', {
                    accountant: data.accountant,
                    countryCode: utilData.phone_code.ISD,
                });
            }).catch(err => {
                console.log(err);
                res.render('error', {
                    message: dbErrorMsg
                });
            });
        } else {
            res.redirect('/dashboard');
        }
    });
});


router.post('/accountant/edit', (req, res, next) => {
    util.authCheck(req, user => {
        if (user) {
            var accountant = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                countryCode: req.body.countryCode,
                phone: req.body.phone,
                address: {
                    address1: req.body.address1,
                    city: req.body.city,
                    state: req.body.state,
                    country: req.body.country,
                    pincode: req.body.pincode,
                },
            };
            axios.post(config.url + '/auth/accountant/update/', {
                accessToken,
                token: user.token,
                accountant
            }).then(responese => {
                console.log('Accountant Updated');
                res.redirect('/dashboard');
            }).catch(err => {
                console.error(err);
                res.render('error', {
                    message: dbErrorMsg
                });
            });
        } else {
            res.redirect('/dashboard');
        }
    });
});


router.get('/create', (req, res, next) => {
    if (tempProfile == null) {
        res.redirect('/signup');
    } else {

        res.render('company/create', {
            error: {
                nameExists: false,
                phoneExists: false,
                emailExists: false
            },
            countryCode: utilData.phone_code.ISD,
            currency: utilData.currency.symbol,
            dateFormat: utilData.datefmt.dateFormat
        });
    }
});


router.post('/create', (req, res, next) => {
    var company = {
        name: req.body.name,
        countryCode: req.body.countryCode,
        phone: req.body.phone,
        email: req.body.email,
        address: {
            address1: req.body.address1,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            pincode: req.body.pincode,

        },
        currency: req.body.currency.substring(0, 1),
        datefmt: req.body.datefmt,
        taxrate: req.body.taxrate,
    };
    var payload = {
        name: company.name,
        phone: company.phone,
        email: company.email,
        accessToken: accessToken
    };

    axios.post(config.url + '/auth/company/exists/', payload)
        .then(response => {
            var data = response.data;
            if (data.nameExists || data.phoneExists || data.emailExists) {
                res.render('company/create', {
                    error: {
                        nameExists: data.nameExists,
                        phoneExists: data.phoneExists,
                        emailExists: data.emailExists
                    },
                    countryCode: utilData.phone_code.ISD,
                    currency: utilData.currency.symbol,
                    dateFormat: utilData.datefmt.dataFormat
                });
            } else {
                var accountants = ['Head'];
                var profilesCreated = 0;
                if (req.body.clientAcc != undefined) {
                    accountants.push('Client');
                }
                if (req.body.expenseAcc != undefined) {
                    accountants.push('Expense');
                }
                if (req.body.generalAcc != undefined) {
                    accountants.push('General');
                }
                company.accountants = accountants;
                company.profilesCreated = profilesCreated;
                tempProfile.company = company;
                // Company data added to temp profile then add accountant data
                res.redirect('/company/accountant/create');
            }
        })
        .catch(error => {
            console.error(error);
            res.render('error', {
                message: dbErrorMsg
            });
        });
});

router.get('/edit', (req, res, next) => {
    util.authCheck(req, user => {
        if (user) {
            res.render('company/edit', {
                company: user.company,
                countryCode: utilData.phone_code.ISD,
                currency: utilData.currency.symbol,
                dateFormat: utilData.datefmt.dateFormat
            });
        } else {
            res.redirect('/dashboard');
        }
    });
});

router.post('/edit', (req, res, next) => {
    util.authCheck(req, user => {
        if (user) {
            company = {
                countryCode: req.body.countryCode,
                phone: req.body.phone,
                address: {
                    address1: req.body.address1,
                    city: req.body.city,
                    state: req.body.state,
                    country: req.body.country,
                    pincode: req.body.pincode,
                },
                currency: req.body.currency.substring(0, 1),
                datefmt: req.body.datefmt,
                taxrate: req.body.taxrate,
            };
            axios.post(config.url+'/auth/company/update/', {
                accessToken,
                token: user.token,
                company
            }).then(response => {
                console.log('Company create');
                res.redirect('/dashboard');
            }).catch(err => {
                console.log(err);
                res.redirect('/dashboard');
            }); 
        } else {
            res.redirect('/dashboard');
        }
    });
});


module.exports = router;