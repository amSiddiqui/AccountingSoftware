const express = require('express');

const router = express.Router();

const seeds = require('../seeds');


router.get('/accountant/create', (req, res, next) => {
    res.render('company/accountant/create', {
        accountant: 'Head',
        countryCode: seeds.countryCode,
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
