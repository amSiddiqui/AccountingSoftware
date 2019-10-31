const express = require("express");

const router = express.Router();

const seeds = require('../seeds');


const categories = [
    'Education', 'Food', 'Advertising'
];

router.get('/', (req, res, next)=> {
    res.render('expense/expense');
});

router.get('/create', (req, res, next) => {
    res.render('expense/create', {
        categories: seeds.categories,
        vendors: seeds.vendors
    });
});

router.get('/edit', (req, res, next) => {
    res.render('expense/edit', {
        categories: seeds.categories,
        vendors: seeds.vendors,
        expense: seeds.pseudoExpense
    });
});

router.get('/:id', (req, res, next) => {
    res.render('expense/show');
});

module.exports = router;
