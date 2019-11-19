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
      var currency = user.company.currency;      
      let inv = axios.post(config.url + '/invoice/latest/',{
        accessToken:accessToken,
        token: user.token,
        quantity: 15,
        datefmt: user.company.datefmt,
      });
      
      let expen = axios.post(config.url + '/expense/latest/',{
        accessToken:accessToken,
        token: user.token,
        quantity: 15,
        datefmt: user.company.datefmt,
      });
      
      let clnt = axios.post(config.url + '/client/latest/',{
        accessToken:accessToken,
        token: user.token,
        quantity: 15,
        datefmt: user.company.datefmt,
      });
      axios.all([inv,expen,clnt]).then(axios.spread((...response) => { 

        const resinv = response[0].data.invoices;
        const resexpen = response[1].data.expenses;
        const resclnt = response[2].data.clients;
        var totalInvoiced =0;
        var totalPaid =0;
        var totalDue = 0;
        var total = 0;
        var i;
        if(type == 'INVOICE DETAIL'){
          for(i in resinv){
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
            company: user.company.name,
          });
        }
        else if(type == "CLIENT REPORT"){
          total =0;
          for(i in resclnt){
            total += resclnt[i].stats.total;
          }
          res.render('report/show', {type: type, client: resclnt,total:total,currency: user.company.currency,company: user.company.name,});
        }
        else if(type == "PAYMENT PENDING"){
          totalDue = 0;
          for(i in resinv){
            totalDue += resinv[i].balanceDue;
          }
          res.render('report/show',{
            type: type,
            invoice: resinv,
            currency: user.company.currency,
            total: totalDue,
            company: user.company.name,
          });
        }

        else if(type == "PAYMENT RECEIVED"){
          totalPaid = 0;
          for(i in resinv){
            totalPaid += resinv[i].amountPaid;
          }
          res.render('report/show',{
            type: type,
            invoice: resinv,
            currency: user.company.currency,
            total: totalPaid,
            company: user.company.name,
          });
        }
        // TODO: fetch all clients from database associated with a particular item
        else if(type == "ITEM SOLD"){
          var pseudoItem = [];
          var invID;
          var invDate;
          var fname;
          var lname;
          var c_ID;
          var temp= {};
          var detailsTemp = {};
          let itId = -1;
          var totalUnits =0;
          var totalAmount=0;
          resinv.forEach( inv =>{
            invID = inv.id;
            invDate = inv.date;
            fname = inv.client.firstName;
            lname = inv.client.lastName;
            c_ID = inv.client.id;
            inv.items.forEach(items=>{
              totalUnits += items.quantity;
              totalAmount += items.price;
              if(pseudoItem.length == 0){
                temp = {
                  Item_Id: items.Item_Id,
                  Name: items.Name,
                  Description: items.Description,
                  Rate: items.Rate,
                  details: [],
                  totalQuantity: 0,
                  totalPrice:0,
                };
                detailsTemp = {
                  quantity: items.quantity,
                  price: items.price,
                  invoiceID: invID,
                  invoiceDate:invDate,
                  clientID : c_ID,
                  clientName: {firstName:fname,lastName:lname},

                };
                temp.totalQuantity = detailsTemp.quantity;
                temp.totalPrice = detailsTemp.price;
                temp.details.push(detailsTemp);
                pseudoItem.push(temp);
                }
                else{
                  if(pseudoItem.some(itm => itm.Item_Id === items.Item_Id)){
                    detailsTemp = {
                      quantity: items.quantity,
                      price: items.price,
                      invoiceID: invID,
                      invoiceDate:invDate,
                      clientID : c_ID,
                      clientName: {firstName:fname,lastName:lname},
                    };
                    for(var i in pseudoItem){
                      if(pseudoItem[i].Item_Id === items.Item_Id){
                        pseudoItem[i].details.push(detailsTemp);
                        pseudoItem[i].totalQuantity += detailsTemp.quantity;
                        pseudoItem[i].totalPrice += detailsTemp.price;
                        break;
                      }
                    }
                  }
                  else{
                    temp = {
                      Item_Id: items.Item_Id,
                      Name: items.Name,
                      Description: items.Description,
                      Rate: items.Rate,
                      details: [],
                      totalQuantity: 0,
                      totalPrice:0,
                    };
                    detailsTemp = {
                      quantity: items.quantity,
                      price: items.price,
                      invoiceID: invID,
                      invoiceDate:invDate,
                      clientID : c_ID,
                      clientName: {firstName:fname,lastName:lname},
                    };
                    temp.totalQuantity = detailsTemp.quantity;
                    temp.totalPrice = detailsTemp.price;
                    temp.details.push(detailsTemp);
                    pseudoItem.push(temp); 
                  }
                }
              });
            });
            res.render('report/show', {
              type: type, 
              pseudoItems: pseudoItem, 
              currency: user.company.currency,
              totalUnits: totalUnits,
              totalAmount:totalAmount,
              company: user.company.name, 
            });
        }

          else if(type == 'EXPENSE REPORT'){
            total =0;
            
            for(i in resexpen){
              total += resexpen[i].amount;
            }
            res.render('report/show', {
              type: type,
              expense: resexpen,
              currency: currency,
              total:total,
              company: user.company.name,
            });
          }
          else if(type == 'PROFIT LOSS'){
            var expenseTotal =0;
            var salesTotal =0;

            for(i in resexpen){
              expenseTotal += resexpen[i].amount;
            }
            for(i in resinv){
              salesTotal += resinv[i].total;
            }
            var profit = salesTotal-expenseTotal;

            res.render('report/show',{
              type: type,
              expense: resexpen,
              invoice: resinv,
              salesTotal:salesTotal,
              expenseTotal:expenseTotal,
              profit:profit,
              currency: user.company.currency,
              company: user.company.name,
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
      res.redirect('/dashboard');
    }
  });

});

module.exports = router;
