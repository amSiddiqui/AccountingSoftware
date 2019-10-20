const express = require("express");

const router = express.Router();

const pseudoClient = {
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
    lateFeeRate: '3.15'
};

router.get('/', (req, res, next) => {
    res.render('client');
});


router.get('/:id', (req, res, next) => {
    res.render('client/show', {
        client: pseudoClient,
    });
});

router.get('/create', (req, res, next) => {
    res.render('client/create', {
        countryCode: ['+91', '+88', '+65'],
    });
});

router.get('/edit', (req, res, next) => {
    res.render('client/edit', {
        client: pseudoClient,
        countryCode: ['+91', '+88', '+65'],
    });
});

module.exports = router;