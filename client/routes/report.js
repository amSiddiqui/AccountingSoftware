const express = require('express');

const router = express.Router();

router.get('/', (req,res,next) => {
  res.render('report/report');
});

router.get('/:type', (req , res, next) => {
  type = req.params.type.toUpperCase();
  type = type.replace('-', ' ');
  var pseudoItem =  {
    clientName: 'Amit Singh',
    invoiceID: '00001',
    invoiceDate: '10/28/2019',
    unitCost: '$250000.00',
    quantity: '1',
    discount: '0%',
    total: '$250000.00',
    itemType: 'IT Consulting',
    tax: '0.00',
    paid: '$100000.00',
    paidDate: '10/29/2019',
    due: '$150000.00',
    description: '',
  };

  var pseudoExpense = {
    vendorName: 'Aslia',
    description: 'Educating new interns',
    date: '10/28/2019',
    amount: '$250000.00',
    quantity: '1',
    discount: '0%',
    expenseType: 'Education',
    tax: '0.00',
    total: '$250000.00',
  };
  var pseudoProfitLoss = {
    sales: '$25000.00',
    cost: '$0.00',
    expenseType: 'Education',
    expenseTotal: '$20000.00',
    profit: '$5000.00',
  };
  if(type == 'ITEM SOLD' || type == "INVOICE DETAIL" || type == "CLIENT REPORT" || type == "PAYMENT RECEIVED" ||type == "PAYMENT PENDING"){

    res.render('report/show', {type: type, pseudoItem: pseudoItem});
  }

  else if(type == 'EXPENSE REPORT'){
    res.render('report/show', {type: type, pseudoExpense: pseudoExpense});
  }
  else if(type == 'PROFIT LOSS'){
    res.render('report/show',{type: type, pseudoProfitLoss:pseudoProfitLoss});
  }
  else if(type === 'GENERAL LEDGER'|| type === 'BALANCE SHEET'|| type === 'TRIAL BALANCE'){
    res.render('report/show',{type:type, pseudoItem: pseudoItem, pseudoExpense: pseudoExpense,});
  }
  // else
  //   res.send("<h1>" + "Error 404:Page not Found" + "</h1>");

});

module.exports = router;
