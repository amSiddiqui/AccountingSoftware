const express = require('express');

const router = express.Router();

const seeds = require('../seeds');
const config = require('../config/config');

router.get('/', (req,res,next) => {
  res.render('report/report');
});

router.get('/:type', (req , res, next) => {
  type = req.params.type.toUpperCase();
  type = type.replace('-', ' ');
  user.authCheck(req , user =>{
    if(user){

      let oR = axios.post(config.url, + ,'/report/outstandingRevenue/',{

        accessToken:accessToken,
        token: user.token,
      });


      let oD = axios.post(config.url, + ,'/report/overdue/',{
        accessToken:accessToken,
        token: user.token,
      });


      let prof = axios.post(config.url, + ,'/report/profit/',{
        accessToken:accessToken,
        token: user.token,
      });


      let rev = axios.post(config.url, + ,'/report/revenue/',{
        accessToken:accessToken,
        token: user.token,
      });


      let exp = axios.post(config.url, + ,'/report/expense/',{
        accessToken:accessToken,
        token: user.token,
      });
      let inv = axios.post(config.url, + ,'/invoice/',{
        accessToken:accessToken,
        token: user.token,
        quantity: 4
      });

      let expen = axios.post(config.url, + ,'/expense/',{
        accessToken:accessToken,
        token: user.token,
      });

      let clnt = axios.post(config.url, + ,'/client/',{
        accessToken:accessToken,
        token: user.token,
      });


      var currency = utilData.country.currency;
      axios.all([oR, oD, prof,rev,exp,inv,expen,clnt]).then(axios.spread((...res) => {
        const resoR = res[0];
        const resoD = res[1];
        const resprof = res[2];
        const resrev = res[3];
        const resexp = res[4];
        const resinv = res[5];
        const resexpen = res[6];
        const resclnt = res[7];

        if(type == 'INVOICE DETAIL'){

          var totalInvoiced =0;
          var totalPaid =0;
          var totalDue = 0;
          for(var i in resinv){
            totalInvoiced += resinv.total;
            totalPaid += resinv.amountPaid;
            totalDue += resinv.balanceDue;
          }
          res.render('report/show',{
            invoice : resinv,
            currency: currency,
            totalInvoiced: totalInvoiced,
            totalPaid: totalPaid,
            totalDue: totalDue,
          });
        }
        else if(type == "CLIENT REPORT"){
          var total =0;
          for(var i in resclnt){
            total += resclnt[i].total;
          }
          res.render('report/show', {type: type, client: resclnt,total:total,currency: utilData.company.currency,});
        }
        else if(type == "PAYMENT PENDING"){
          var totalDue = 0;
          for(var i in resinv){
            totalDue += resinv[i].balanceDue;
          }
          res.render('report/show',{
            type: type,
            invoice: resinv,
            currency: utilData.company.currency,
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
            currency: utilData.company.currency,
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
              expenseTotal += resexpen[i].subtotal
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
              currency: utilData.company.currency,
            });
          }
          // else if(type === 'GENERAL LEDGER'|| type === 'BALANCE SHEET'|| type === 'TRIAL BALANCE'){
            //   res.render('report/show',{type:type, pseudoItem: seeds.pseudoItem, pseudoExpense: seeds.pseudoExpense,});
            // }
            else{
              res.send('ERROR:PAGE NOT FOUND');
            }
        // use/access the results
      })).catch(errors => {
        console.log(err);
        res.render('error',{message:err.response.data})
      })



    }
    else{
      res.redirect('/dashboard')
    }
  })

});

module.exports = router;
