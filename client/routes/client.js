const express = require("express");

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('client');
});

router.get('/create', (req, res, next) => {
    res.render('client/create', {
        countryCode: ['+91', '+88', '+65'],
    });
});

module.exports = router;