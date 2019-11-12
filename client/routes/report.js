const express = require('express');

const router = express.Router();

const seeds = require('../seeds');

router.get('/', (req,res,next) => {
  res.render('report/report');
});

router.get('/:type', (req , res, next) => {
  type = req.params.type.toUpperCase();
  type = type.replace('-', ' ');

  if(type == 'INVOICE DETAIL'){
    var totalInvoiced =0;
    var totalPaid =0;
    var totalDue = 0;
    for(var i in seeds.invoices){
      totalInvoiced += seeds.invoices[i].total;
      totalPaid += seeds.invoices[i].amountPaid;
      totalDue += seeds.invoices[i].balanceDue;
    }
    res.render('report/show',{
      invoice : seeds.invoices,
      currency: seeds.currency[2],
      totalInvoiced: totalInvoiced,
      totalPaid: totalPaid,
      totalDue: totalDue,
    });
  }
  else if(type == "CLIENT REPORT"){
    var total =0;
    for(var i in seeds.pseudoClient){
      total += seeds.pseudoClient[i].total;
    }
    res.render('report/show', {type: type, client: seeds.pseudoClient,total:total,currency: seeds.currency[2],});
  }
  else if(type == "PAYMENT PENDING"){
    var totalDue = 0;
    for(var i in seeds.invoices){
      totalDue += seeds.invoices[i].balanceDue;
    }
    res.render('report/show',{
      type: type,
      invoice: seeds.invoices,
      currency: seeds.currency[2],
      total: totalDue,
    });
  }

  else if(type == "PAYMENT RECEIVED"){
    var totalPaid = 0;
    for(var i in seeds.invoices){
      totalPaid += seeds.invoices[i].amountPaid;
    }
    res.render('report/show',{
      type: type,
      invoice: seeds.invoices,
      currency: seeds.currency[2],
      total: totalPaid,
    });
  }

  else if(type == "ITEM SOLD" || type == "CLIENT REPORT"){

    res.render('report/show', {type: type, pseudoItem: seeds.pseudoItem});
  }

  else if(type == 'EXPENSE REPORT'){
    var total =0;
    for(var i in seeds.pseudoExpense){
      total += seeds.pseudoExpense[i].subtotal
    }
    res.render('report/show', {
      type: type,
      expense: seeds.pseudoExpense,
      currency: seeds.currency[2],
      total:total,
    });
  }
  else if(type == 'PROFIT LOSS'){
    var expenseTotal =0;
    var salesTotal =0;

    for(var i in seeds.pseudoExpense){
      expenseTotal += seeds.pseudoExpense[i].subtotal
    }
    for(var i in seeds.invoices){
      salesTotal += seeds.invoices[i].total;
    }
    var profit = salesTotal-expenseTotal;

    res.render('report/show',{
      type: type,
      expense: seeds.pseudoExpense,
      salesTotal:salesTotal,
      expenseTotal:expenseTotal,
      profit:profit,
      currency: seeds.currency[2],
    });
  }
  else if(type === 'GENERAL LEDGER'|| type === 'BALANCE SHEET'|| type === 'TRIAL BALANCE'){
    res.render('report/show',{type:type, pseudoItem: seeds.pseudoItem, pseudoExpense: seeds.pseudoExpense,});
  }
  else{
    res.send('ERROR:PAGE NOT FOUND');
  }

});

module.exports = router;
