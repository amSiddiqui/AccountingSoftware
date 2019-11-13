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
                    countryCode: ['+91', '+88', '+65'],
                    email: tempProfile.headAcc.email,
                    password: tempProfile.headAcc.password
                });
            } else {
                accountant = tempProfile.company.accountants[tempProfile.company.profilesCreated++];

                res.render('company/accountant/create', {
                    accountant: accountant,
                    countryCode: ['+91', '+88', '+65'],
                    email: null,
                    password: null
                });
            }
        }
    }
});

router.post('/accountant/create', (req, res, next) => {
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

    axios.post(dburl + 'auth/accountant/exists', payload)
        .then(response => {
            var data = JSON.parse(response.data);
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
                    axios.post(config.url+'/signup/', payload)
                        .then(response => {
                            var data = response.data;
                            const user = {
                                name: tempProfile.headAcc.firstName.substring(0, 1)+'. '+tempProfile.headAcc.lastName,
                                email: tempProfile.headAcc.email,
                                company: tempProfile.company,
                                token: data.token
                            };
                            res.cookie('user',user,cookieOpt);
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
                    countryCode: ['+91', '+88', '+65'],
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
});

router.get('/accountant/edit', util.validateUser({}), (req, res) => {
    res.render('company/accountant/edit', {
        accountant: seeds.psuedoAccountant,
        countryCode: seeds.countryCode,
    });
});

// TODO: add edit router to accountant

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
            countryCode: ['+91', '+88', '+65'],
            currency: ['$ (USD)', '€ (EUR)', '£ (GBP)', '₹ (INR)'],
            dateFormat: ['dd/mm/yyy', 'mm/dd/yyyy', 'yyyy/mm/dd']
        });
    }
});


router.post('/create', util.validateUser({}) ,(req, res, next) => {
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
        currency: req.body.currency,
        datefmt: req.body.datefmt,
        taxrate: req.body.taxrate,
    };
    // TODO: add database authentication to company creation
    var payload = {
        name: company.name,
        phone: company.phone,
        email: company.email,
        accessToken: accessToken
    };

    axios.post(dburl + 'auth/company/exists', payload)
        .then(response => {
            var data = JSON.parse(response.data);
            if (data.nameExists || data.phoneExists || data.emailExists) {
                res.render('company/create', {
                    error: {
                        nameExists: nameExists,
                        phoneExists: phoneExists,
                        emailExists: emailExists
                    },
                    countryCode: ['+91', '+88', '+65'],
                    currency: ['$ (USD)', '€ (EUR)', '£ (GBP)', '₹ (INR)'],
                    dateFormat: ['dd/mm/yyy', 'mm/dd/yyyy', 'yyyy/mm/dd']
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

router.get('/edit', util.validateUser({}), (req, res, next) => {
    res.render('company/edit', {
        company: seeds.pseudoCompany,
        countryCode: seeds.countryCode,
        currency: seeds.currency,
        dateFormat: seeds.dateFormat
    });
});

// TODO: create edit route for company create

module.exports = router;