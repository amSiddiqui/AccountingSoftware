const express = require("express");
const router = express.Router();
const util = require('../modules/utility');
const seeds = require('../seeds');
const bodyParser = require('body-parser');
const app = express();
const config = require('../config/config');
const axios = require('axios')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));



router.get('/', (req, res, next) => {
  util.authCheck(req, (user) => {

    if (user) {
      var outstanding = 0;
      var total = 0;
      var overdue = 0;
      var draft = 0;
      var clients = [];
      //TODO: fetch total ,outstanding,overdue,draft
      // TODO: Use axios
      axios.post(config.url + '/client/latest/', {
        token: user.token,
        accessToken: accessToken,
        quantity: 15,
      }).then(response => {
        clients = response.data.clients;
        var smallClient = [];
        var i = 0;
        clients.forEach(function (client) {
          if (i++ < 3) {
            smallClient.push(client);
          }
          outstanding += parseFloat(client.stats.outstanding);
          total += parseFloat(client.stats.total);
          draft += parseFloat(client.stats.overdue);
        });
        res.render('client/client', {
          clients: clients,
          smallClient: smallClient,
          totalOutstanding: outstanding,
          totalOverdue: draft,
          totalDraft: draft,
          currency: user.company.currency,
          total: total,
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


router.get('/create', (req, res, next) => {
  util.authCheck(req, (user) => {
    if (user) {
      res.render('client/create', {
        countryCode: utilData.phone_code.ISD,
      });
    } else {
      res.redirect('/dashboard');
    }
  });
});

router.post('/', (req, res) => {
  util.authCheck(req, (user) => {
    if (user) {
      //TODO: fetch auto-generate ID
      var params = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        countryCode: req.body.countryCode,
        phone: req.body.phone,
        email: req.body.email,
        address: {
          address1: req.body.address1,
          city: req.body.city,
          state: req.body.state,
          country: req.body.country,
          pincode: req.body.pincode,
        },
        lateFeeRate: req.body.lateFeeRate,
        dayLimit: req.body.dayLimit,
      }
      // TODO: Push data into database using axios
      axios.post(config.url + '/client/create/', {
        token: user.token,
        accessToken: accessToken,
        client: params,
      }).then(response => {
        console.log('Client Added');
        res.redirect('/client');
      }).catch(err => {
        console.error(err);
        res.render('error', {
          message: dbErrorMsg
        });
      });
    } else {
      res.redirect('/dashboard');
    }
  });
});



router.put('/:id', (req, res) => {
  util.authCheck(req, (user) => {
    if (user) {

      axios.post(config.url + `/client/${req.params.id}/`, {
        token: user.token,
        accessToken: accessToken,
      }).then(res1 => {
        old_client = res1.data.client;
        
        old_client.firstName = req.body.firstName;
        old_client.lastName = req.body.lastName;
        old_client.countryCode = req.body.countryCode;
        old_client.phone = req.body.phone;
        old_client.email = req.body.email;
        old_client.address.address1 = req.body.address1;
        old_client.address.city = req.body.city;
        old_client.address.state = req.body.state;
        old_client.address.country = req.body.country;
        old_client.address.pincode = req.body.pincode;
        old_client.lateFeeRate = req.body.lateFeeRate;
        old_client.dayLimit = req.body.dayLimit;
        

        axios.post(config.url + `/client/${req.params.id}/update/`, {
          token: user.token,
          accessToken: accessToken,
          client: old_client,
        }).then(response => {
          console.log('client updated');
          res.redirect('/client');
        }).catch(error => {
          console.log(error);
          res.render('error', {
            message: dbErrorMsg
          })
        });
      });
    }
    else {
      res.redirect('/dashboard')
    }
  });
});

router.get('/:id', (req, res, next) => {
  util.authCheck(req, (user) => {
    if (user) {
      var invoiceArr = [];
      var clientInvoice = [];
      dueSum = 0;
      total = 0;
      axios.post(config.url + `/client/${req.params.id}/`, {
        accessToken: accessToken,
        token: user.token,
        months: 3,
        datefmt: user.company.datefmt
      }).then(response => {
        console.log('Client with id '+req.params.id+' recieved is: ', response.data);
        var client = response.data.client;
        invoiceArr = response.data.invoices;
        invoiceArr.forEach(function (invoice) {
          if (invoice.client.id == req.params.id) {
            clientInvoice.push(invoice);
            dueSum += parseFloat(invoice.balanceDue);
            total += parseFloat(invoice.total);
          }
        });
        res.render('client/show', {
          client: client,
          invoice: clientInvoice,
          totalDue: dueSum,
          total: total,
          currency: user.company.currency,
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


router.get('/:id/edit/', (req, res, next) => {
  util.authCheck(req, (user) => {
    if (user) {
      axios.post(config.url + `/client/${req.params.id}/`, {
        token: user.token,
        accessToken: accessToken,
      }).then(response => {
        var client = response.data.client;
        res.render('client/edit', {
          client: client,
          countryCode: utilData.phone_code.ISD,
        });
      }).catch(error => {
        console.log(error);
        res.render('error', {
          message: dbErrorMsg
        });
      });

    } else {
      res.redirect('/dashboard')
    }

  });
});

router.delete('/delete', (req, res, next) => {
  util.authCheck(req, (user) => {
    if (user) {
      var ids = [];
      ids = req.body.row;
      axios.post(config.url + "/client/delete/", {
          token: user.token,
          accessToken: accessToken,
          clients: ids
        })
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
      res.redirect('/client');
    } else {
      res.redirect('/dashboard');
    }
  });
});

module.exports = router;