const express = require("express");
const router = express.Router();
const util = require('../modules/utility');
const axios = require('axios');


router.get('/', (req, res, next) => {
    res.redirect('/login');
});

// Login Routes

router.get('/login', (req, res) => {
    util.authCheck(req,(user)=>{
        if(user){
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

    res.send('TODO');
});


router.get('/signup', (req, res, next) => {
    util.authCheck(req,(user)=>{
        if( user ) {
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
    var outstandingRevenue = data.outstandingRevenue;
    var percent = (data.outstandingRevenue / 70000.0) * 100.0; 
    var currency = req.cookies.user.company.currency;
    var rev_clients = [];
    var revenue = [];
    var exp_vendor = [];
    var expenditure = [];
    data.revenueStream.forEach(rev => {
        rev_clients.push(rev.client);
        revenue.push(rev.revenue);
    });

    data.spending.forEach(data => {
        exp_vendor.push(data.vendor);
        expenditure.push(data.spent);
    });

    var totalRev = inKNotation(data.totalRevenue);

    
    var totalExp = inKNotation(data.totalSpending);

    var overdue = inKNotation(data.overdue);

    var unb_clients = [];
    var unb_days = [];
    var unb_dues = [];
    data.unbilledTimes.forEach(unb => {
        unb_clients.push(unb.client);
        unb_days.push(unb.time);
        unb_dues.push(unb.due);
    });

    res.render('dashboard', {
        quote: {quote: 'You miss 100 percent of the shots you don’t take.', author: 'Wayne Gretzky'},
        percent: percent,
        outstandingRevenue: new Intl.NumberFormat().format(outstandingRevenue),
        currency: currency.substring(0, 1),
        profit: data.profit,
        totalProfit: data.totalProfit,
        revStream: {
            clients: rev_clients,
            revenue: revenue,
            total: totalRev
        },
        expense: {
            vendors: exp_vendor,
            expenditure: expenditure,
            total: totalExp
        },
        unbilled: {
            clients: unb_clients,
            days: unb_days,
            dues: unb_dues,
            total: overdue
        }
    });
});

function inKNotation(val) {
    var totalExp = val;
    var totalExpStr = `${totalExp}`;
    if (totalExp > 1000) {
        totalExp = parseFloat(totalExp / 1000.).toFixed(2);
        if (parseInt(totalExp) == totalExp) {
            totalExp = parseInt(totalExp);
        }
        totalExpStr = `${totalExp}k`;
    }
    return totalExpStr;
}

module.exports = router;
