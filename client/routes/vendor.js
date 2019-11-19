const express = require("express");

const router = express.Router();
const util = require('../modules/utility');
const config = require('../config/config');
const seeds = require('../seeds');
const axios = require('axios');

router.get('/create', (req, res, next) => {
  util.authCheck(req, user => {
    if (user) {
      res.render('vendor/create', {
        countryCode: utilData.phone_code.ISD,
      });
    } else {
      res.redirect('/dashboard');
    }
  });
});

router.post('/', (req, res, next) => {
  util.authCheck(req, user => {
    if (user) {
      vendor = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        countryCode: req.body.countryCode,
        address: {
          address1: req.body.name,
          city: req.body.city,
          state: req.body.state,
          country: req.body.country,
          pincode: req.body.pincode
        }
      };
      axios.post(config.url + '/vendor/create/', {
        token: user.token,
        accessToken: accessToken,
        vendor: vendor
      }).then(response => {
        console.log('Vendor created');
        res.redirect('/expense/create');
      }).catch(err => {
        console.error(err);
        res.render('error', {
          message: dbErrorMsg
        });
      });
    } else {
      res.redirect('/dashboard');
    }
  });
});

module.exports = router;