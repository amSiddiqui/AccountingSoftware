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


router.get('/', (req, res, next) => {
    res.redirect('/login');
});

// Login Routes

router.get('/login', (req, res) => {
    util.authCheck(req ,(user)=>{

        // FIXME: change it user to redirect to dahsboard 

        if(false){
            res.redirect('/dashboard');
        }else{
            res.render('login', {
                error: false
            });
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
                // TODO: Add user object to local session so that it can be displayed in partials
                res.redirect('/dashboard');
            }else{
                res.status(401);
            }
        })
        .catch(err=>{
            console.log('auth/login: '+err);
            // Database side error
            res.render('error', {
                message: dbErrorMsg
            });
        });
    }else{
        res.status(400);
        res.render( 'login', {
            error: true
        });
    }
});


router.get('/signup', (req, res, next) => {
    util.authCheck(req,(user)=>{
        // FIXME: Check user
        if( false ) {
            res.redirect('/dashboard');
        } else {
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

    tempProfile = {
        headAcc: {
            email: email,
            password: password                    
        }
    };

    res.redirect('/company/create');
    
    axios.post(dburl + 'auth/accountant/exists', payload)
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
            message: dbErrorMsg
        });
    });
});


router.get('/dashboard', util.validateUser({}), (req, res) => {
    res.render('dashboard', {
        quote: {quote: 'You miss 100 percent of the shots you don’t take.', author: 'Wayne Gretzky'},
    });
});

module.exports = router;
