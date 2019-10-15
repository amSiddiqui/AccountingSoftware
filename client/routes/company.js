const express = require('express');

const router = express.Router();


router.get('/accountant/create', (req, res, next) => {
    res.render('company/accountant/create', {
        accountant: 'Head',
        countryCode: ['+91', '+88', '+65'],
        email: "gt_ams@yahoo.in"
    });
});

router.get('/accountant/edit', (req, res, next) => {
    res.render('company/accountant/edit', {
        accountant: 'Head',
        countryCode: ['+91', '+88', '+65'],
        email: "gt_ams@yahoo.in"
    });
});

router.get('/create', (req, res, next) => {
    res.render('company/create', {
        countryCode: ['+91', '+88', '+65'],
        currency: ['$ (USD)', '€ (EUR)', '£ (GBP)', '₹ (INR)'],
        dateFormat: ['dd/mm/yyy', 'mm/dd/yyyy', 'yyyy/mm/dd']
    });
});

router.get('/edit', (req, res, next) => {
    pseudoCompany = {
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
        dateFormat: ['dd/mm/yyy', 'mm/dd/yyyy', 'yyyy/mm/dd']
    });
});

module.exports = router;