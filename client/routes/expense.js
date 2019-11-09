const express = require("express");

const router = express.Router();

const seeds = require('../seeds');


router.get('/', (req, res, next)=> {

    res.render('expense/expense',{
      expense: seeds.pseudoExpense,
    });
});

router.get('/create', (req, res, next) => {
    res.render('expense/create', {
        categories: seeds.categories,
        vendors: seeds.vendors,
        countryCode: seeds.countryCode,
    });
});

router.post('/',(req , res) => {
  var params= {
    id: '654322',
    category: req.body.category,
    date: req.body.date,
    vendor: req.body.vendor,
    phone: req.body.phone,
    countryCode: req.body.countryCode,
    description: req.body.description,
    subtotal: req.body.subtotal,
  }
  seeds.pseudoExpense.push(params);
  res.redirect('/expense');
});

router.get('/:id/edit', (req, res, next) => {
    var expense = seeds.pseudoExpense.find(expense => expense.id === req.params.id);
    res.render('expense/edit', {
        categories: seeds.categories,
        vendors: seeds.vendors,
        expense: expense,
        countryCode: seeds.countryCode,
    });
});

router.put('/:id', (req , res) => {
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

  res.redirect('/expense');
});

router.get('/:id', (req, res, next) => {
    res.render('expense/show');
});

module.exports = router;
