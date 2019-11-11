const express = require("express");

const router = express.Router();
const util = require('../modules/utility');

const seeds = require('../seeds');

router.get('/create', (req, res, next) => {
    util.authCheck(req, user => { 
        if (user) 
        {
            // TODO: Use axios
            res.render('vendor/create', {
                countryCode: seeds.countryCode,
            });
        }
        else
        {
            res.redirect('/dashboard');
        }
    });
});

module.exports = router;
