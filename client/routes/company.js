const express = require('express');
const axios = require('axios');


const router = express.Router();
const util = require('../modules/utility');

const seeds = require('../seeds');


router.get('/accountant/create', (req, res, next) => {
	
	res.render('company/createAccountant', {
		accountant: 'Head',
		countryCode: ['+91', '+88', '+65'],
		email: "gt_ams@yahoo.in"
	});
});


router.get('/accountant/edit', (req, res, next) => {

    res.render('company/accountant/edit', {
        accountant: seeds.psuedoAccountant,
        countryCode: seeds.countryCode,
    });
});

router.get('/create', (req, res, next) => {
	if (tempProfile == null) {
        res.redirect('/signup');
    }else{
        res.render('company/create', {
            countryCode: ['+91', '+88', '+65'],
            currency: ['$ (USD)', '€ (EUR)', '£ (GBP)', '₹ (INR)'],
            dateFormat: ['dd/mm/yyy', 'mm/dd/yyyy', 'yyyy/mm/dd']
        });
    }
});


router.post('/create', (req, res, next) => {
    // TODO: Add middleware to check if user already logged in, if he is then cannot create new company
    
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

    var accountants = ['Head Accountant'];
    if (req.body.clientAcc != undefined) {
        accountants.push('Client Accountant');
    }
    if (req.body.expenseAcc != undefined) {
        accountants.push('Expense Accountant');
    }
    if (req.body.generalAcc != undefined) {
        accountants.push('General Accountant');
    }
    company.accountants = accountants;
    res.render('company/create', {
        countryCode: seeds.countryCode,
        currency: seeds.currency,
        dateFormat: seeds.dateFormat
    });
});

router.get('/edit', (req, res, next) => {


    res.render('company/edit', {
        company: seeds.pseudoCompany,
        countryCode: seeds.countryCode,
        currency: seeds.currency,
        dateFormat: seeds.dateFormat
    });
});

module.exports = router;
