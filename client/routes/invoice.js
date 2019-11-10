const express = require("express");

const router = express.Router();
const util = require('../modules/utility');

const seeds = require('../seeds');

router.get('/', (req, res, next) => {
    util.authCheck(req, (user) => {
        if (user) {
            // TODO: use axios
            var invoiceData = seeds.invoiceGenData;
            var allInvoices = seeds.invoices;
            var recentInvoices = allInvoices.slice(0, 3);
            var quickInvoice = [];
            var clients = seeds.pseudoClient;
            var currency = user.company.currency;
            recentInvoices.forEach(invoice => {
                var temp = {
                    id: invoice.id,
                    client: invoice.client,
                    date: invoice.date,
                    amountDue: invoice.amountDue
                };
                quickInvoice.push(temp);
            });
            res.render('invoice/invoice', {
                invoiceData: invoiceData,
                latestInvoices: quickInvoice,
                invoices: allInvoices,
                currency: currency.substring(0, 1),
                clients: clients
            });
        }else{
            res.redirect('/dashboard');
        }
    });
});

router.post('/proceed', (req, res, next) => {
    util.authCheck(req, (user) => {
        if (user) {
            var clientId = req.body.client;
            // Get client from database
            // TODO: Use axio to fetch data
            // axios.post(dburl+'client/'+clientId, {
            //     token: user.token,
            //     accessToken: accessToken
            // }).then(response => {
            //     var data = JSON.parse(response.data);
            //     var client = data.client;
            //     res.render('invoice/create', {
            //         client: client
            // TODO: Add dynamic id of invoice number
            //         invoiceNumber: 23
            //     });
            // }).catch(error => {
            //     console.error(error);
            //     res.render('error', {
            //         message: dbErrorMsg
            //     });
            // });

            var clients = seeds.pseudoClient;
            var client;
            clients.forEach(cl => {
                if (parseInt(clientId) == cl.id) {
                    client = cl;
                }
            });
            var today = new Date();
            var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
            res.render('invoice/create', {
                client: client,
                invoiceNumber: 23,
                currency: user.company.currency.substring(0, 1),
                date: date
            });
        }else {
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
            var amountDue = req.body.amountDue;
            var total = req.body.total;
            var amountPaid = req.body.amountPaid;
            var balanceDue = req.body.balanceDue;
            var notes = req.body.notes;
            var items = [];
            for (let index = 1; index <= noRows; index++) {
                var item = {
                    item: req.body['item'+index],
                    description: req.body['description'+index],
                    rate: req.body['rate'+index],
                    quantity: req.body['quantity'+index],
                    price: req.body['price'+index],
                };
                items.push(item);
            }

            var invoice = {
                id: invoiceNumber,
                clientID: clientID,
                date: date,
                amountDue: amountDue,
                amountPaid: amountPaid,
                total: total,
                balanceDue: balanceDue,
                items: items,
                notes: notes,
            };

            // Axios post request to save data
            axios.post(dburl+'invoice/create', {
                accessToken: accessToken,
                token: user.token,
                invoice: invoice
            })
            .then(response => {
                console.log("Invoice added");
                res.redirect('/invoice');
            })
            .error(err => {
                console.error(err);
                res.render('error', {
                    message: dbErrorMsg
                });
            });

            res.send('Successfully submitted form');
        }else{
            res.redirect('/dashboard');
        }
    });
});

// TODO: create a batch delete route /batchDelete
router.post('/batchDelete', (req, res, next) => {
    // Fetch total number of invoices
    var totalInvocies = 2;


});


// TODO: Create invoice show page
router.get('/:id', (req, res, next) => {
    util.authCheck(req, (user) => {
        if (user) {
            // Fetch invoice details from the database
            var id = parseInt(req.params.id);
            // TODO: Use axios
            console.log("Id recieved: ", id);
            // TODO: remove
            var invoices = seeds.invoices;
            var invoice;
            invoices.forEach(invo => {
                if (invo.id == id) {
                    invoice = invo;
                }
            });
            res.render('invoice/edit', {
                currency: user.company.currency.substring(0, 1),
                invoice: invoice
            });
        }else{
            res.redirect('/dashboard');
        }
    });
});


module.exports = router;