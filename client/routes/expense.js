const express = require("express");
const router = express.Router();
const util = require('../modules/utility');
const seeds = require('../seeds');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res, next)=> {
  util.authCheck(req ,(user) => {
    if(user){
      var total = 0;
      seeds.pseudoExpense.forEach((expense) =>{
        total += expense.subtotal;
      });
      res.render('expense/expense',{
        expense: seeds.pseudoExpense,
        currency: seeds.currency[3],
        total:total,
      });

    }
    else {
      res.redirect('/dashboard')
    }
  })
});

router.get('/create', (req, res, next) => {
  util.authCheck(req, (user) => {
    if(user){
      res.render('expense/create', {
        categories: seeds.categories,
        vendors: seeds.vendors,
        countryCode: seeds.countryCode,
      });
    }
    else{
      res.redirect('/dashboard');
    }
  })
});

router.post('/',(req , res) => {
  util.authCheck(req , (user) => {
    if(user){
      id = 2;
      var params= {
        id: id,
        category: req.body.category,
        date: req.body.date,
        vendor: req.body.vendor,
        phone: req.body.phone,
        countryCode: req.body.countryCode,
        description: req.body.description,
        subtotal: req.body.subtotal,
      }
      id++;
      seeds.pseudoExpense.push(params);
      res.redirect('/expense');

    }
    else {
      res.redirect('/dashboard')
    }
  });
});

router.get('/:id/edit', (req, res, next) => {
  util.authCheck(req, (user) => {
    if(user){
      var expense = seeds.pseudoExpense.find(expense => expense.id === parseInt(req.params.id));

      res.render('expense/edit', {
        categories: seeds.categories,
        vendors: seeds.vendors,
        expense: expense,
        countryCode: seeds.countryCode,
      });
    }
    else {
      res.redirect('/dashboard')
    }
  });
});

router.put('/:id', (req , res) => {
  util.authCheck(req , (user) =>{
    if(user){
      for(var i in seeds.pseudoExpense){
        if(seeds.pseudoExpense[i].id === req.params.id){
          seeds.pseudoExpense[i].category= req.body.category;
          seeds.pseudoExpense[i].date= req.body.date;
          seeds.pseudoExpense[i].vendor= req.body.vendor;
          seeds.pseudoExpense[i].phone= req.body.phone;
          seeds.pseudoExpense[i].countryCode= req.body.countryCode;
          seeds.pseudoExpense[i].description= req.body.description;
          seeds.pseudoExpense[i].subtotal= req.body.subtotal;
          break;
        }
    }
  }
    else{
      res.redirect('/dashboard');
    }
  });

  res.redirect('/expense');
});

router.delete('/delete',(req,res,next) =>{
  util.authCheck(req , (user) =>{
    if(user){
      var ids = []
      var ids = req.body.row;
      for(var i in ids){
        for(var j in seeds.pseudoExpense){
          if(ids[i] == seeds.pseudoExpense[j].id){
            seeds.pseudoExpense.splice(j,1);
            break;
          }
        }
      }

      res.redirect('/expense');
    }
    else{
      res.redirect('/dashboard');
    }
  });
});

router.get('/:id', (req, res, next) => {
    res.redirect('/expense/'+req.params.id+'/edit');
});

module.exports = router;
