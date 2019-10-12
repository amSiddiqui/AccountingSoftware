const express = require('express');

const router = express.Router();


router.get('/accountant/create', (req, res, next) => {
    res.render('company/create', {
        accountant: 'Head',
        countryCode: ['+91', '+88', '+65'],
        email: "gt_ams@yahoo.in"
    });
});

router.get('/create', (req, res, next) => {
    res.render('company/accountant/create', {
        countryCode: ['+91', '+88', '+65'],
        currency: ['$ (USD)', '€ (EUR)', '£ (GBP)', '₹ (INR)'],
        dateFormat: ['dd/mm/yyy', 'mm/dd/yyyy', 'yyyy/mm/dd']
    });
});

module.exports = router;