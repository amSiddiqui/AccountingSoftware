const express = require("express");

const router = express.Router();

const seeds = require('../seeds');


router.get('/', (req, res, next) => {
    res.render('client/client');
});

router.get('/create', (req, res, next) => {
  res.render('client/create', {
    countryCode: seeds.countryCode,
  });
});
router.get('/edit', (req, res, next) => {
  res.render('client/edit', {
    client: seeds.pseudoClient,
    countryCode: seeds.countryCode,
  });
});

router.get('/:id', (req, res, next) => {
    res.render('client/show', {
        client: seeds.pseudoClient,
    });
});



module.exports = router;
