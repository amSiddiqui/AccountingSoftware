const express = require('express');

const router = express.Router();

const seeds = require('../seeds');

router.get('/', (req,res,next) => {
  res.render('report/report');
});

router.get('/:type', (req , res, next) => {
  type = req.params.type.toUpperCase();
  type = type.replace('-', ' ');
  user.authCheck(req , user =>{
    if(user){
      let oR = axios.post(dburl + ,'/report/outstandingRevenue/',{
        accessToken:accessToken,
        token: user.token,
      });

      let oD = axios.post(dburl + ,'/report/overdue/',{
        accessToken:accessToken,
        token: user.token,
      });

      let prof = axios.post(dburl + ,'/report/profit/',{
        accessToken:accessToken,
        token: user.token,
      });

      let rev = axios.post(dburl + ,'/report/revenue/',{
        accessToken:accessToken,
        token: user.token,
      });

      let exp = axios.post(dburl + ,'/report/expense/',{
        accessToken:accessToken,
        token: user.token,
      });
      let inv = axios.post(dburl + ,'/invoice/',{
        accessToken:accessToken,
        token: user.token,
        quantity: 4
      })

      axios.all([oR, oD, prof,rev,exp,inv]).then(axios.spread((...res) => {
        const resoR = res[0]
        const resoD = res[1]
        const resprof = res[2]
        const resrev = res[3]
        const resexp = res[4]
        const resinv = res[5]
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
        // TODO: fetch all clients from database associated with a particular item
        // else if(type == "ITEM SOLD"){
          //
          //   res.render('report/show', {type: type, pseudoItem: seeds.pseudoItem});
          // }

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
          // else if(type === 'GENERAL LEDGER'|| type === 'BALANCE SHEET'|| type === 'TRIAL BALANCE'){
            //   res.render('report/show',{type:type, pseudoItem: seeds.pseudoItem, pseudoExpense: seeds.pseudoExpense,});
            // }
            else{
              res.send('ERROR:PAGE NOT FOUND');
            }
        // use/access the results
      })).catch(errors => {
        // react on errors.
      })



    }
    else{
      res.redirect('/dashboard')
    }
  })

});

module.exports = router;
