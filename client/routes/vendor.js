const express = require("express");

const router = express.Router();

const seeds = require('../seeds');

router.get('/create', (req, res, next) => {
    res.render('vendor/create', {
        countryCode: seeds.countryCode,
    });
});

router.get('/edit', (req, res, next) => {

    res.render('vendor/edit', {
        vendor: seeds.pseudoVendor,
        countryCode: seeds.countryCode,
    });
});

module.exports = router;
