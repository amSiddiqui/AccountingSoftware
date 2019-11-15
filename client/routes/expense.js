const express = require("express");
const router = express.Router();
const util = require('../modules/utility');
const bodyParser = require('body-parser');
const app = express();
const config = require('../config/config');
const axios = require('axios');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/', (req, res, next) => {
  util.authCheck(req, (user) => {
    if (user) {
      var total = 0;
      var expenses = [];
      var expensetab = [];
      axios.post(config.url + '/expense/latest/', {
        token: user.token,
        accessToken: accessToken,
        quantity: 20,
      }).then(response => {
        expenses = response.data.expenses;
        var quick = 0;
        expenses.forEach(expense => {
          if (quick++ < 3) {
            expensetab.push(expense);
          }
          total += expense.amount;
        });
        res.render('expense/expense', {
          expense: expenses,
          quickExpense:expensetab,
          currency: user.company.currency,
          total: total,
        });
      }).catch(err => {
        console.log(err);
        res.render('error', {
          message: dbErrorMsg,
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
      var vendor = [];
      axios.post(config.url + '/vendor/', {
        accessToken: accessToken,
        token: user.token,
      }).then(response => {
        vendor = response.data.vendor;
        axios.post(config.url+'/category/', {
          accessToken,
          token: user.token
        }).then(response2 => {
          categories = response2.data.categories;
          res.render('expense/create', {
            categories: categories,
            vendors: vendor,
            countryCode: utilData.phone_code.ISD,
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
          message: dbErrorMsg,
        });
      });

    } else {
      res.redirect('/dashboard');
    }
  });
});

router.post('/', (req, res) => {
  util.authCheck(req, (user) => {
    if (user) {
      var params = {
        category: req.body.category,
        date: req.body.date,
        vendor: req.body.vendor,
        phone: req.body.Phone,
        Country_Code: req.body.countryCode,
        description: req.body.description,
        amount: req.body.amount,
      };
      axios.post(config.url + '/expense/create/', {
        token: user.token,
        accessToken: accessToken,
        expense: params,
        datefmt: user.company.datefmt
      }).then(response => {
        console.log('Expense Added');

        res.redirect('/expense');
      }).catch(err => {
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

router.get('/:id/edit', (req, res, next) => {
  util.authCheck(req, (user) => {
    if (user) {
      var vendor = [];
      axios.post(config.url + `/expense/${req.params.id}/`, {
        token: user.token,
        accessToken: accessToken,
      }).then(response => {
        expense = response.data.expense;
        axios.post(config.url + '/vendor/', {
          accessToken: accessToken,
          token: user.token,
        }).then(response => {
          vendor = response.data.vendor;

          axios.post(config.url+'/category/', {
            accessToken,
            token: user.token
          }).then(response2 => {
            categories = response2.data.categories;
            console.log('Expense recieved: ', expense);
            res.render('expense/edit', {
              categories: categories,
              vendors: vendor,
              expense: expense,
              countryCode: utilData.phone_code.ISD,
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
            message: dbErrorMsg,
          });
        });
      }).catch(err => {
        console.log(err);
        res.render('error', {
          message: dbErrorMsg,
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
      var params = {
        category: req.body.category,
        date: req.body.date,
        vendor: req.body.vendor,
        phone: req.body.Phone,
        Country_Code: req.body.countryCode,
        description: req.body.description,
        amount: req.body.amount,
      };
      axios.post(config.url+`/expense/${req.params.id}/update/`, {
        accessToken,
        token: user.token,
        expense: params,
        datefmt: user.company.datefmt
      }).then(response => {
        console.log('Expense updated successfully');
        res.redirect('/expense');
      }).catch(err => {
        console.log(err);
        res.redirect('/dashboard');
      });
    } else {
      res.redirect('/dashboard');
    }

  });
});


router.delete('/delete', (req, res, next) => {
  util.authCheck(req, (user) => {
    if (user) {
      ids = [];
      var ids = req.body.row;
      axios.post(config.url + '/expense/delete/', {
        token: user.token,
        accessToken: accessToken,
        expense: ids,
      }).then(response => {
        res.redirect('/expense');
      }).catch(err => {
        res.render('error', {
          message: dbErrorMsg,
        });
      });
    } else {
      res.redirect('/dashboard');
    }
  });
});

router.get('/:id', (req, res, next) => {
  res.redirect('/expense/' + req.params.id + '/edit');
});

module.exports = router;
