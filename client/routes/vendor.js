const express = require("express");

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('vendor/vendor');
});

router.get('/create', (req, res, next) => {
    res.render('vendor/create', {
        countryCode: ['+91', '+88', '+65'],
    });
});

router.get('/edit', (req, res, next) => {
    const pseudoVendor = {
        name: 'SecretShop',
        countryCode: '+65',
        phone: '2975107492',
        email: 'carl@hunter.gg',
        address1: 'Monterey Bay Aquarium, 886 Cannery Row',
        city: 'Monterey',
        state: 'California',
        country: 'USA',
        pincode: '93940',
    };
    res.render('vendor/edit', {
        vendor: pseudoVendor,
        countryCode: ['+91', '+88', '+65'],
    });
});

module.exports = router;
