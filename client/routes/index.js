const express = require("express");
const router = express.Router();
const Authentication = require('../modules/auth');
const auth = new Authentication(router);
const util = require('../modules/utility');
// (async()=>{ await auth.conn();})()
auth.conn();
console.log('hello')

const cookieOpt = {
    maxAge: 24 * 60 * 60,
    httpOnly: true,
};

router.get('/', (req, res) => {
    // If not logged then redirect to login
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    // console.log(req);
    util.authCheck(req,(user)=>{
        if(user){
            res.redirect('/dashboard');
        }else{
            res.render('login');
        }
    })
});

router.get('/signup', (req, res) => {
    util.authCheck(req, (user)=>{
        if(user){
            res.redirect('/dashboard');
        }else{
            res.render('signup');
        }
    })
});

router.get('/dashboard', util.validateUser({}), (req, res) => {
    res.render('dashboard', {
        quote: {quote: 'You miss 100 percent of the shots you don’t take.', author: 'Wayne Gretzky'},
        
    });
});

router.post('/login',(req,res)=>{
    const user = {...req};
    console.log(user);
    if( typeof(user.username) == 'string' && typeof(user.password) == 'string'){
        auth.login(user).then(result=>{;
            if( typeof(result) == 'object' && result.profile != null){
                req.cookies('user', user, cookieOpt);
                res.redirect('/dashboard');
            }else{
                res.status(401);
            }
        })
        .catch(err=>{
            console.log('auth/login: '+err);
        });
    }else{
        res.status(400);
    }
    res.send('Invalid username and password');
});

module.exports = router;
