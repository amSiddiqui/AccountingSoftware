const express = require("express");

const router = express.Router();

router.get('/', (req, res, next) => {
    // If not logged then redirect to login
    res.redirect('/login');
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

module.exports = router;