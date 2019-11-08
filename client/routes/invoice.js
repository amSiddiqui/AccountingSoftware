const express = require("express");

const router = express.Router();

const seeds = require('../seeds');

router.get('/', (req, res, next)=> {
    res.render('invoice/invoice');
});

router.get('/create', (req, res, next) => {
    res.render('invoice/create', {
        categories: seeds.categories,
        vendors: seeds.vendors
    });
});

router.get('/edit', (req, res, next) => {
    res.render('invoice/edit', {
        categories: seeds.categories,
        vendors: seeds.vendors,
        expense: seeds.pseudoExpense
    });
});

module.exports = router;
