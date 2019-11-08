const express = require("express");
const router = express.Router();

const Authentication = require('../modules/auth');
const auth = new Authentication(router);
const util = require('../modules/utility');
auth.conn();

const cookieOpt = {
    maxAge: 24 * 60 * 60,
    httpOnly: true,
};

const axios = require('axios');

// TODO: Remove this route
router.get('/error', (req, res, next) => {
    res.render('error', {
        message: "an error message"
    });
});

router.get('/', (req, res, next) => {
    res.redirect('/login');
});

// Login Routes

router.get('/login', (req, res) => {
    util.authCheck(req,(user)=>{
        if(user){
            res.redirect('/dashboard');
        }else{
            res.render('login');
        }
    });
});


router.post('/login',(req,res)=>{
    const user = {
        username: req.body.email,
        password: req.body.password
    };
    if( typeof(user.username) == 'string' && typeof(user.password) == 'string'){
        auth.login(user).then(result=>{
            if( typeof(result) == 'object' && typeof(result.profile) == 'object'){
                res.cookie('user',result, cookieOpt);
                // req.app.locals.user = {
                //     username: result.profile.firstName+' '+result.profile.lastName,
                //     company: result.profile.company
                // };
                res.redirect('/dashboard');
            }else{
                res.status(401);
            }
        })
        .catch(err=>{
            console.log('auth/login: '+err);
            // Database side error
        });
    }else{
        res.status(400);
        res.send( 'error', 'Invalid username and password');
    }
    // Invalid Username and password
    
});




router.get('/signup', (req, res, next) => {
    util.authCheck(req,(user)=>{
        if(user){
            res.redirect('/dashboard');
        }else{
            res.render('signup');
        }
    });
});

router.post('/signup', util.validateUser({}), (req, res) => {
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


router.get('/dashboard', util.validateUser({}), (req, res) => {
    res.render('dashboard', {
        quote: {quote: 'You miss 100 percent of the shots you don’t take.', author: 'Wayne Gretzky'},
        
    });
});

module.exports = router;
