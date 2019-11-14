const express = require('express');
const router = express.Router();
const util = require('../modules/utility');
const seeds = require('../seeds');
const config = require('../config/config');
const axios = require('axios');

router.get('/', (req,res,next) => {
  util.authCheck(req , user =>{
    if(user){
      res.render('report/report');
    }
    else{
      res.redirect('/dashboard');
    }

  });
});

router.get('/:type', (req , res, next) => {
  type = req.params.type.toUpperCase();
  type = type.replace('-', ' ');
  util.authCheck(req , user =>{
    if(user){


      let inv = axios.post(config.url, + 'invoice/latest/',{
        accessToken:accessToken,
        token: user.token,
        quantity: 5,
      });

      let expen = axios.post(config.url, + 'expense/latest/',{
        accessToken:accessToken,
        token: user.token,
        quantity: 5,
      });

      let clnt = axios.post(config.url, + 'client/latest/',{
        accessToken:accessToken,
        token: user.token,
        quantity: 5,
      });
      var currency = user.company.currency;
      axios.all([inv,expen,clnt]).then(axios.spread((...res) => {
        // const resoR = res[0].data.;
        // const resoD = res[1];
        // const resprof = res[2];
        // const resrev = res[3];
        // const resexp = res[4];
        const resinv = res[0].data.invoices;
        const resexpen = res[1].data.expenses;
        const resclnt = res[2].data.clients;
        console.log(resinv);
        if(type == 'INVOICE DETAIL'){

          var totalInvoiced =0;
          var totalPaid =0;
          var totalDue = 0;
          for(var i in resinv){
            totalInvoiced += resinv[i].total;
            totalPaid += resinv[i].amountPaid;
            totalDue += resinv[i].balanceDue;
          }
          res.render('report/show',{
            invoice : resinv,
            currency: user.company.currency,
            totalInvoiced: totalInvoiced,
            totalPaid: totalPaid,
            totalDue: totalDue,
          });
        }
        else if(type == "CLIENT REPORT"){
          var total =0;
          for(var i in resclnt){
            total += resclnt[i].stats.total;
          }
          res.render('report/show', {type: type, client: resclnt,total:total,currency: user.company.currency,});
        }
        else if(type == "PAYMENT PENDING"){
          var totalDue = 0;
          for(var i in resinv){
            totalDue += resinv[i].balanceDue;
          }
          res.render('report/show',{
            type: type,
            invoice: resinv,
            currency: user.company.currency,
            total: totalDue,
          });
        }

        else if(type == "PAYMENT RECEIVED"){
          var totalPaid = 0;
          for(var i in resinv){
            totalPaid += resinv[i].amountPaid;
          }
          res.render('report/show',{
            type: type,
            invoice: resinv,
            currency: user.company.currency,
            total: totalPaid,
          });
        }
        // TODO: fetch all clients from database associated with a particular item
        // else if(type == "ITEM SOLD"){
          //
          //   res.render('report/show', {type: type, pseudoItem: seeds.pseudoItem});
          // }

          else if(type == 'EXPENSE REPORT'){
            var total =0;
            for(var i in resexpen){
              total += resexpen[i].subtotal
            }
            res.render('report/show', {
              type: type,
              expense: resexpen,
              currency: currency,
              total:total,
            });
          }
          else if(type == 'PROFIT LOSS'){
            var expenseTotal =0;
            var salesTotal =0;

            for(var i in resexpen){
              expenseTotal += resexpen[i].amount
            }
            for(var i in resinv){
              salesTotal += resinv[i].total;
            }
            var profit = salesTotal-expenseTotal;

            res.render('report/show',{
              type: type,
              expense: resexpen,
              salesTotal:salesTotal,
              expenseTotal:expenseTotal,
              profit:profit,
              currency: user.company.currency,
            });
          }
          // else if(type === 'GENERAL LEDGER'|| type === 'BALANCE SHEET'|| type === 'TRIAL BALANCE'){
            //   res.render('report/show',{type:type, pseudoItem: seeds.pseudoItem, pseudoExpense: seeds.pseudoExpense,});
            // }
            else{
              res.send('ERROR:PAGE NOT FOUND');
            }
        // use/access the results
      })).catch(err => {
        console.log(err);
        res.render('error',{message:dbErrorMsg});
      });

    }
    else{
      res.redirect('/dashboard')
    }
  })

});

module.exports = router;
