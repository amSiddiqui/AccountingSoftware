const express = require('express');

const router = express.Router();

const seeds = require('../seeds');

router.get('/', (req,res,next) => {
  res.render('report/report');
});

router.get('/:type', (req , res, next) => {
  type = req.params.type.toUpperCase();
  type = type.replace('-', ' ');

  if(type == 'ITEM SOLD' || type == "INVOICE DETAIL" || type == "CLIENT REPORT" || type == "PAYMENT RECEIVED" ||type == "PAYMENT PENDING"){

    res.render('report/show', {type: type, pseudoItem: seeds.pseudoItem});
  }

  else if(type == 'EXPENSE REPORT'){
    res.render('report/show', {type: type, pseudoExpense: seeds.pseudoExpenseR});
  }
  else if(type == 'PROFIT LOSS'){
    res.render('report/show',{type: type, pseudoProfitLoss: seeds.pseudoProfitLoss});
  }
  else if(type === 'GENERAL LEDGER'|| type === 'BALANCE SHEET'|| type === 'TRIAL BALANCE'){
    res.render('report/show',{type:type, pseudoItem: seeds.pseudoItem, pseudoExpense: seeds.pseudoExpenseR,});
  }
  else{
    res.send('ERROR:PAGE NOT FOUND');
  }

});

module.exports = router;
