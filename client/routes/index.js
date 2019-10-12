const express = require("express");

const router = express.Router();

router.get('/', (req, res, next) => {
    // If not logged then redirect to login
    res.redirect('/login');
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.get('/dashboard', (req, res, next) => {
    res.render('dashboard', {
        quote: {quote: 'You miss 100 percent of the shots you don’t take.', author: 'Wayne Gretzky'},
        
    });
});

module.exports = router;