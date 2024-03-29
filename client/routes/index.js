const express = require("express");
const router = express.Router();
const util = require('../modules/utility');
const axios = require('axios');
const config = require('../config/config');

router.get('/', (req, res, next) => {
    res.redirect('/login');
});

// Login Routes

router.get('/login', (req, res) => {
    util.authCheck(req, (user) => {
        if (user) {
            res.redirect('/dashboard');
        } else {
            res.render('login', {
                error: false
            });
        }
    });
});


router.get('/logout', (req, res) => {
    util.authCheck(req, user => {
        if (user) {
            axios.post(config.url + '/auth/logout/', {
                accessToken: accessToken,
                token: user.token
            }).then(response => {
                res.clearCookie('user');
                res.redirect('/login');
            }).catch(err => {
                res.render('error', {
                    message: err.response.data
                });
            });
        } else {
            res.redirect('/login');
        }
    });
});

router.post('/login', (req, res, next) => {
    util.authCheck(req, user => {
        if (user) {
            res.redirect('/dashboard');
        } else {
            const userData = {
                email: req.body.email,
                password: req.body.password
            };
            axios.post(config.url + '/auth/login/', {
                accessToken: accessToken,
                email: userData.email,
                password: userData.password
            }).then(response => {
                res.cookie('user', response.data, cookieOpt);
                res.redirect('/dashboard');
            }).catch(err => {
                console.error(err);
                if (err.response == undefined) {
                    res.render('error', {
                        message: dbErrorMsg
                    });
                }else{
                    res.render('login', {
                        error: true
                    });
                }
            });
        }
    });
});


router.get('/signup', (req, res, next) => {
    util.authCheck(req, (user) => {
        if (user) {
            res.redirect('/dashboard');
        } else {
            res.render('signup');
        }
    });
});

router.post('/signup', (req, res) => {
    util.authCheck(req, user => {
        if (user) {
            console.log("User already signed in cannot signup now: ", user);
            res.redirect('/dashboard');
        } else {
            var email = req.body.email;
            var password = req.body.password;
            var payload = {
                accessToken: accessToken,
                email: email
            };
            axios.post(config.url + '/auth/accountant/exists/', payload)
            .then(response => {
                var data = response.data;
                if (data.exists) {
                    res.render('signup', {
                        userExists: true
                    });
                } else {
                    // Proceed forward to signup
                    tempProfile = {
                        headAcc: {
                            email: email,
                            password: password
                        }
                    };
                    res.redirect('/company/create');
                }
            })
            .catch(error => {
                console.error(error);
                res.render('error', {
                    message: dbErrorMsg
                });
            });
        }
    });
});


async function loadReports(token, load) {
    if (!load) {
        return;
    }
    const rev_response = (await axios.post(config.url + '/report/outstandingRevenue/', {
        token,
        accessToken,
        startMonth: 6,
        endMonth: 0
    })).data;

    utilData.totalOutRevenue = rev_response.revenue;

    const overdue_response = (await axios.post(config.url + '/report/overdue/', {
        token,
        accessToken,
        startMonth: 6,
        endMonth: 0
    })).data;
    utilData.overdue = overdue_response.overdue;

    const profit_reponse = (await axios.post(config.url + '/report/profit/', {
        accessToken,
        token,
        startMonth: 6,
        endMonth: 0
    })).data;
    utilData.profit = profit_reponse.profit;
    var totalProfit = 0.0;
    utilData.profit.forEach(p => {
        totalProfit += parseFloat(p);
    });
    utilData.totalProfit = totalProfit;

    const revStream_response = (await axios.post(config.url + '/report/revenue/', {
        token,
        accessToken,
        startMonth: 6,
        endMonth: 0,
        quantity: 6
    })).data;

    utilData.revenueStream = revStream_response.revenue;
    utilData.totalRevenue = revStream_response.totalRevenue;

    const spending_response = (await axios.post(config.url + '/report/expense/', {
        token,
        accessToken,
        startMonth: 6,
        endMonth: 0,
        quantity: 6
    })).data;
    utilData.expenses = spending_response.expense;
    utilData.totalSpending = spending_response.totalExpense;

    const unbilled_respone = (await axios.post(config.url + '/report/unbilled/', {
        token,
        accessToken,
        startMonth: 6,
        endMonth: 0,
        quantity: 6
    })).data;

    utilData.unbilled = unbilled_respone;
}


router.get('/dashboard', (req, res) => {
    util.authCheck(req, user => {
        if (user) {
            var load = utilData.totalOutRevenue == undefined;
            loadReports(user.token, load).then(() => {
                var outstandingRevenue = utilData.totalOutRevenue;
                var percent = (utilData.totalOutRevenue / 70000.0) * 100.0;
                var currency = req.cookies.user.company.currency;
                var rev_clients = [];
                var revenue = [];
                var exp_vendor = [];
                var expenditure = [];
                utilData.revenueStream.forEach(rev => {
                    rev_clients.push(rev.client);
                    revenue.push(rev.revenue);
                });

                utilData.expenses.forEach(da => {
                    exp_vendor.push(da.vendor);
                    expenditure.push(da.expense);
                });

                var totalRev = inKNotation(utilData.totalRevenue);

                var totalProfit = inKNotation(utilData.totalProfit);

                var totalExp = inKNotation(utilData.totalSpending);

                var overdue = inKNotation(utilData.overdue);

                var unb_clients = [];
                var unb_days = [];
                var unb_dues = [];
                utilData.unbilled.expense.forEach(unb => {
                    unb_clients.push(unb.client);
                    unb_days.push(unb.days);
                    unb_dues.push(unb.due);
                });

                const quoteLen = utilData.quotes.quote.length;
                const random_idx = Math.floor(quoteLen * Math.random());
                const rawQuote = {
                    ...utilData.quotes
                }
                const quote = {
                    quote: rawQuote['quote'][random_idx],
                    author: `${rawQuote['fName'][random_idx]} ${rawQuote['lName'][random_idx]}`
                }
                res.render('dashboard', {
                    quote,
                    percent: percent,
                    outstandingRevenue: new Intl.NumberFormat().format(outstandingRevenue),
                    currency: currency.substring(0, 1),
                    profit: utilData.profit,
                    totalProfit: totalProfit,
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
                        total: utilData.unbilled.totalOverdue
                    }
                });
            }).catch(error => {
                console.log(error);
                res.render('error', {
                    message: dbErrorMsg
                });
            });
        } else {
            res.redirect('/login');
        }
    });
});

function inKNotation(val) {
    var totalExp = val;
    var totalExpStr = `${totalExp}`;
    if (totalExp > 1000) {
        totalExp = parseFloat(totalExp / 1000.0).toFixed(2);
        if (parseInt(totalExp) == totalExp) {
            totalExp = parseFloat(totalExp);
        }
        totalExpStr = `${totalExp}k`;
    }
    return totalExpStr;
}

module.exports = router;