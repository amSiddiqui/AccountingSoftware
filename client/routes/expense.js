const express = require("express");
const router = express.Router();
const util = require('../modules/utility');
const seeds = require('../seeds');
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
      var exp = [];
      axios.post(config.url + '/expense/latest/', {
        token: user.token,
        accessToken: accessToken,
        quantity: 15,
      }).then(response => {
        expense = response.data.expense;
        expense.forEach((expense) => {
          total += expense.subtotal;
        });
        res.render('expense/expense', {
          expense: expense,
          currency: user.company.currency,
          total: total,
        });
      }).catch(err => {
        res.render('error', {
          message: err.response.data,
        });
      });
      // seeds.pseudoExpense.forEach((expense) => {
      //   total += expense.subtotal;
      // });
      // res.render('expense/expense', {
      //   expense: seeds.pseudoExpense,
      //   currency: seeds.currency[3],
      //   total: total,
      // });

    } else {
      res.redirect('/dashboard');
    }
  });
});

router.get('/create', (req, res, next) => {
  util.authCheck(req, (user) => {
    if (user) {
      var vendor = [];
      axios.post(config.url + '/vendor/',{
        accessToken:accessToken,
        token:user.token,
      }).then(response =>{
        vendor = response.data.vendor;
        res.render('expense/create', {
          categories: utilData.categories,
          vendors: vendor,
          countryCode: utilData.countryCode,
        });
      }).catch(err =>{
        console.log(err);
        res.render('error',{message:dbErrorMsg,});
      });

    } else {
      res.redirect('/dashboard');
    }
  });
});

router.post('/', (req, res) => {
  util.authCheck(req, (user) => {
    if (user) {
      //TODO: fetch auto-generated id
      id = 2;
      var params = {
        id: id,
        category: req.body.category,
        date: req.body.date,
        vendor: req.body.vendor,

        phone: req.body.phone,
        countryCode: req.body.countryCode,
        description: req.body.description,
        subtotal: req.body.subtotal,
      };
      id++;
      // seeds.pseudoExpense.push(params);

      // TODO: Push data into database using axios
      axios.post(config.url + '/expense/create/', {
        token: user.token,
        accessToken: accessToken,
        expense: params,
      }).then(response => {
        console.log('Expense Added');

        res.render('/expense');
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
      // var expense = seeds.pseudoExpense.find(expense => expense.id === parseInt(req.params.id));
      axios.post(config.url + `/expense/${req.params.id}/`,{
        token:user.token,
        accessToken:accessToken,
      }).then(response =>{
        expense = response.data.expense;
        axios.post(config.url + '/vendor/',{
          accessToken:accessToken,
          token:user.token,
        }).then(response =>{
          vendor = response.data.vendor;
          res.render('expense/edit', {
            categories: utilData.categories,
            vendors: vendor.vendors,
            expense: expense,
            countryCode: utilData.countryCode,
          });
        }).catch(err =>{
          console.log(err);
          res.render('error',{message:dbErrorMsg,});
        });
      }).catch(err =>{
        console.log(err);
        res.render('error',{message:dbErrorMsg,});
      });

    } else {
      res.redirect('/dashboard');
    }
  });
});

router.put('/:id', (req, res) => {
  util.authCheck(req, (user) => {
    if (user) {

      axios.post(config.url + `/expense/${req.params.id}/`, {
        token: user.token,
        accessToken: accessToken,
      }).then(res1 => {
        res1 = res1.data;
        for (var i in res1) {
          if (res1[i].id == req.params.id) {
            res1[i].category = req.body.category;
            res1[i].date = req.body.date;
            res1[i].vendor = req.body.vendor;
            res1[i].phone = req.body.phone;
            res1[i].countryCode = req.body.countryCode;
            res1[i].description = req.body.description;
            res1[i].subtotal = req.body.subtotal;
            break;
          }
        }


        axios.post(config.url + `/expense/${req.params.id}/update/`, {
          token: user.token,
          accessToken: accessToken,
          expense: res1,
        }).then(response => {
          console.log('expense updated');
          axios.post(config.url + `/expense/${req.params.id}/update/`, {
            token: user.token,
            accessToken: accessToken,
            client: res1,
          }).then(response => {
            console.log('client updated');

            res.render('/expense/' + req.params.id);
          }).catch(error => {
            console.log(error);
            res.render('error', {
              message: dbErrorMsg,
            });
          });
        }).catch(err => {
          console.log(error);
          res.render('error', {
            message: dbErrorMsg,
          });
        });


        // for(var i in seeds.pseudoExpense){
        //   if(seeds.pseudoExpense[i].id === req.params.id){
        //     seeds.pseudoExpense[i].category= req.body.category;
        //     seeds.pseudoExpense[i].date= req.body.date;
        //     seeds.pseudoExpense[i].vendor= req.body.vendor;
        //     seeds.pseudoExpense[i].phone= req.body.phone;
        //     seeds.pseudoExpense[i].countryCode= req.body.countryCode;
        //     seeds.pseudoExpense[i].description= req.body.description;
        //     seeds.pseudoExpense[i].subtotal= req.body.subtotal;
        //     break;
        //   }

      }).catch(err => {
        console.log(error);
        res.render('error', {
          message: dbErrorMsg,
        });
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
        res.render('/expense' + req.params.id);
      }).catch(err => {
        res.render('error', {
          message: dbErrorMsg,
        });
      });

      // for(var i in ids){
      //   for(var j in seeds.pseudoExpense){
      //     if(ids[i] == seeds.pseudoExpense[j].id){
      //       seeds.pseudoExpense.splice(j,1);
      //       break;
      //     }
      //   }
      // }

      // res.redirect('/expense');
    } else {
      res.redirect('/dashboard');
    }
  });
});

router.get('/:id', (req, res, next) => {
  res.redirect('/expense/' + req.params.id + '/edit');
});

module.exports = router;
