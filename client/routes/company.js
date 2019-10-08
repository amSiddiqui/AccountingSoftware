const express = require('express');

const router = express.Router();


router.get('/create', (req, res, next) => {
    res.render('company/create');
});

module.exports = router;