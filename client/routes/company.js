const express = require('express');
const axios = require('axios');

const router = express.Router();


router.get('/accountant/create', (req, res, next) => {
    res.render('company/accountant/create', {
        accountant: 'Head',
        countryCode: ['+91', '+88', '+65'],
        email: "gt_ams@yahoo.in"
    });
});

router.get('/accountant/edit', (req, res, next) => {
    const psuedoAccountant = {
        accountantType: 'Head',
        firstName: 'Leviathan',
        lastName: 'Tidehunter',
        countryCode: '+65',
        phone: '2975107492',
        email: 'leviathan@hunter.gg',
        address1: 'Monterey Bay Aquarium, 886 Cannery Row',
        city: 'Monterey',
        state: 'California',
        country: 'USA',
        pincode: '93940',
    };
    res.render('company/accountant/edit', {
        accountant: psuedoAccountant,
        countryCode: ['+91', '+88', '+65'],
    });
});

router.get('/create', (req, res, next) => {
    // TODO: Add middleware to check if user already logged in, if he is then cannot create new company
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
    

});

router.get('/edit', (req, res, next) => {
    const pseudoCompany = {
        name: 'Pineapple',
        countryCode: '+88',
        phone: '8528606977',
        email: 'contact@pineapple.co',
        address1: '196 Temple Drive',
        city: 'Dublin',
        state: 'RI',
        country: 'Ireland',
        pincode: '226013',
        currency: '£ (GBP)',
        datefmt: 'mm/dd/yyyy',
        taxrate: '3.14'
    };


    res.render('company/edit', {
        company: pseudoCompany,
        countryCode: ['+91', '+88', '+65'],
        currency: ['$ (USD)', '€ (EUR)', '£ (GBP)', '₹ (INR)'],
        dateFormat: ['dd/mm/yyyy', 'mm/dd/yyyy', 'yyyy/mm/dd']
    });
});

module.exports = router;
