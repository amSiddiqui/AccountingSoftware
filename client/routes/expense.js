const express = require("express");

const router = express.Router();

const pseudoExpense = {
    category: 'Education',
    date: '2018-01-22',
    vendor: 'TCS',
    description: 'financing education',
    subtotal: 22.4
};

const vendors = [
    'ABC',
    'KFC',
    'BMW',
    'TCS',
    'IBM',
    'HP',
    'HDFC',
    'SBI',
    'ICICI'
];

const categories = [
    'Education', 'Food', 'Advertising'
];

router.get('/', (req, res, next)=> {
    res.render('expense/expense');
});

router.get('/create', (req, res, next) => {
    res.render('expense/create', {
        categories: categories,
        vendors: vendors
    });
});

router.get('/edit', (req, res, next) => {
    res.render('expense/edit', {
        categories: categories,
        vendors: vendors,
        expense: pseudoExpense
    });
});

router.get('/:id', (req, res, next) => {
    res.render('expense/show');
});

module.exports = router;