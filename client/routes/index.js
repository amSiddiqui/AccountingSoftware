const express = require("express");

const router = express.Router();
const axios = require('axios');

// TODO: Remove this route
router.get('/error', (req, res, next) => {
    res.render('error', {
        message: "an error message"
    });
});

router.get('/', (req, res, next) => {
    // TODO: Add middleware to redirect to dashboard if logged in else redirect to login
    res.redirect('/login');
});

// Login Routes
router.get('/login', (req, res, next) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    // TODO: Add a middleware to see if already logged in
    var email = req.body.email;
    var password = req.body.password;
    var payload = {
        accessToken: accessToken,
        email: email,
        password: password
    };
    axios.post(dburl+'auth/login', payload)
    .then(response => {

    })
    .catch(error => {
        console.error(error);
        res.render('error', {
            message: 'Database not responding try again later'
        });
    });
});


router.get('/signup', (req, res, next) => {
    // TODO: Add a middleware to check if already logged in. If logged in then then redirect to dashboard
    res.render('signup');
});

router.post('/signup', (req, res, next) => {
    // TODO: Add a middleware to check if already logged in. If logged in then redirect to dashboard
    var email = req.body.email;
    var password = req.body.password;
    var payload = {
        accessToken: accessToken,
        email: email
    };
    axiox.post(dburl + 'auth/exists', payload)
    .then(response => {
        var data = JSON.parse(response.data);
        if (data.exists) {
            res.render('signup', {
                userExists: true
            });
        }else{
            // Proceed forward to signup
            tempProfile = {
                headAcc: {
                    email: email,
                    password: password                    
                }
            };
            res.redirect('/create');
        }
    })
    .catch(error => {
        console.error(error);
        res.render('error', {
            message: 'Database not responding try again later'
        });
    });
});

router.get('/dashboard', (req, res, next) => {
    res.render('dashboard', {
        quote: {quote: 'You miss 100 percent of the shots you don’t take.', author: 'Wayne Gretzky'},
        
    });
});


module.exports = router;