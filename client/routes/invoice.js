const express = require("express");

const router = express.Router();
const util = require('../modules/utility');
const config = require('../config/config');
const seeds = require('../seeds');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/', (req, res, next) => {
    util.authCheck(req, user => {
        if (user) {

            axios.post(config.url + '/invoice/latest/', {
                accessToken: accessToken,
                token: user.token,
                quantity: 500,
                datefmt: user.company.datefmt
            }).then(response => {

                axios.post(config.url + '/client/latest/', {
                    accessToken,
                    token: user.token,
                    quantity: 500
                }).then(response2 => {
                    const clients = response2.data.clients;
                    const invoices = response.data.invoices;
                    var quickInvoice = invoices.slice(0, 3);
                    var currency = user.company.currency;
                    res.render('invoice/invoice', {
                        invoiceData: {
                            totalOverdue: utilData.unbilled.totalOverdue,
                            totalOutstanding: utilData.totalOutRevenue,
                            totalInDraft: utilData.unbilled.totalOverdue
                        },
                        latestInvoices: quickInvoice,
                        invoices: invoices,
                        currency: currency.substring(0, 1),
                        clients: clients
                    });

                }).catch(err => {
                    console.log(err);
                    res.render('error', {
                        message: dbErrorMsg
                    });
                });
            }).catch(err => {
                console.log(err);
                res.render('error', {
                    message: dbErrorMsg
                });
            });
        } else {
            res.redirect('/dashboard');
        }
    });
});


router.post('/proceed', (req, res, next) => {
    util.authCheck(req, user => {
        if (user) {
            var clientId = req.body.client;
            liId = lastInvoiceId + 1;
            lastInvoiceId = liId;
            console.log('Last invoice id: ', lastInvoiceId);
            axios.post(config.url+'/client/'+clientId+'/', {
                accessToken,
                token: user.token,
                datefmt: user.company.datefmt
            }).then(response => {
                const client = response.data.client;
                var today = new Date();
                var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
                res.render('invoice/create', {
                    client: client,
                    invoiceNumber: lastInvoiceId,
                    currency: user.company.currency.substring(0, 1),
                    date: date
                });
            }).catch(err => {
                console.log(err);
                res.render('error', {
                    message: dbErrorMsg
                });
            });
        } else {
            res.redirect('/dashboard');
        }
    });
});

// TODO: create post route for new invoice
router.post('/create', (req, res, next) => {
    util.authCheck(req, user => {
        if (user) {
            var invoiceNumber = req.body.invoiceNumber;
            var clientID = req.body.clientId;
            var noRows = parseInt(req.body.numRows);
            var date = req.body.date;
            var amountDue = parseFloat(req.body.amountDue);
            var total = parseFloat(req.body.total);
            var amountPaid = parseFloat(req.body.amountPaid);
            var balanceDue = parseFloat(req.body.balanceDue);
            var notes = req.body.notes;
            var items = [];
            for (let index = 1; index <= noRows; index++) {
                var item = {
                    item: req.body['item' + index],
                    description: req.body['description' + index],
                    rate: parseFloat(req.body['rate' + index]),
                    quantity: parseInt(req.body['quantity' + index]),
                    price: parseFloat(req.body['price' + index]),
                };
                items.push(item);
            }

            var invoice = {
                id: invoiceNumber,
                clientId: clientID,
                date: date,
                amountDue: amountDue,
                amountPaid: amountPaid,
                total: total,
                balanceDue: balanceDue,
                items: items,
                notes: notes,
            };

            // Axios post request to save data
            axios.post(config.url + '/invoice/create/', {
                    accessToken: accessToken,
                    token: user.token,
                    invoice: invoice,
                    datefmt: user.company.datefmt
                })
                .then(response => {
                    console.log("Invoice added");
                    res.redirect('/invoice');
                })
                .catch(err => {
                    console.error(err);
                    res.render('error', {
                        message: err.response.data,
                    });
                });
        } else {
            res.redirect('/dashboard');
        }
    });
});


router.delete('/delete', (req, res, next) => {
    util.authCheck(req, user => {
        if (user) {
            var ids = req.body.row;
            if (!(ids instanceof Array)) {
                ids = [ids];
            }
            axios.post(config.url + '/invoice/delete/', {
                token: user.token,
                accessToken: accessToken,
                invoices: ids,
            }).then(response => {
                res.redirect('/invoice');
            }).catch(err => {
                res.render('error', {
                    message: err.response.data,
                });
            });

        } else {
            res.redirect('/dashboard');
        }
    });
});


router.get('/:id', (req, res, next) => {
    util.authCheck(req, user => {
        if (user) {
            // Fetch invoice details from the database
            var id = parseInt(req.params.id);
            axios.post(config.url + '/invoice/' + req.params.id+'/', {
                token: user.token,
                accessToken: accessToken
            }).then(response => {
                var invoice = response.data;
                res.render('invoice/edit', {
                    currency: user.company.currency.substring(0, 1),
                    invoice: invoice
                });
            }).catch(err => res.render('error', {
                message: err.response.data,
            }));
        } else {
            res.redirect('/dashboard');
        }
    });
});


module.exports = router;