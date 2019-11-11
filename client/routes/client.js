const express = require("express");
const router = express.Router();
const util = require('../modules/utility');
const seeds = require('../seeds');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



router.get('/', (req, res, next) => {
  util.authCheck(req, (user) =>{

    if(user){
      var outstanding =0;
      var total = 0;
      //TO-DO: fetch total ,outstanding,overdue,draft,
      seeds.pseudoClient.forEach(function(client){
        outstanding += client.amountDue;
        total += client.total
      });
      res.render('client/client',{
        clients: seeds.pseudoClient,
        totalOutstanding: outstanding,
        totalOverdue: outstanding,
        totalDraft: outstanding,
        currency: seeds.currency[2],
        total: total,
      });
    }
    else{
      res.redirect('/dashboard');
    }
  });
});

router.get('/create', (req, res, next) => {
  util.authCheck(req , (user) =>{
    if(user){
      res.render('client/create', {
        countryCode: seeds.countryCode,
      });
    }
    else{
      res.redirect('/dashboard');
    }
  })
});

router.post('/', (req, res) => {
  util.authCheck(req , (user) =>{
    if(user){
      //TODO: create auto-generate ID
      var clientID=4;
      var params = {
        id: clientID,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        countryCode: req.body.countryCode,
        phone: req.body.phone,
        email: req.body.email,
        address : {
          address1: req.body.address1,
          city: req.body.city,
          state: req.body.state,
          country: req.body.country,
          pincode: req.body.pincode,
        },
        lateFeeRate: req.body.lateFeeRate,
        //TODO: Fetch amount due , total and currency from invoice
        amountDue: 200,
        total:270,
        currency: '£ (GBP)',
      }

      clientID++;
      seeds.pseudoClient.push(params);
      res.redirect('/client');
    }
    else{
      res.redirect('/dashboard');
    }
  })

});


router.get('/:id/edit/', (req, res, next) => {
  util.authCheck(req, (user) =>{
    if(user){
      var client = seeds.pseudoClient.find(client => client.id === parseInt(req.params.id));
      res.render('client/edit', {
        client: client,
        countryCode: seeds.countryCode,
      });
    }
    else{
      res.redirect('/dashboard')
    }

  })
});

router.put('/:id',(req,res) => {
  util.authCheck(req ,( user )=> {
    if(user){

      for(var i in seeds.pseudoClient){
        if(seeds.pseudoClient[i].id == req.params.id){
          seeds.pseudoClient[i].firstName = req.body.firstName;
          seeds.pseudoClient[i].lastName= req.body.lastName;
          seeds.pseudoClient[i].countryCode= req.body.countryCode;
          seeds.pseudoClient[i].phone= req.body.phone;
          seeds.pseudoClient[i].email= req.body.email;
          seeds.pseudoClient[i].address.address1= req.body.address1;
          seeds.pseudoClient[i].address.city= req.body.city;
          seeds.pseudoClient[i].address.state= req.body.state;
          seeds.pseudoClient[i].address.country= req.body.country;
          seeds.pseudoClient[i].address.pincode= req.body.pincode;
          seeds.pseudoClient[i].lateFeeRate= req.body.lateFeeRate;
          break;
        }
      }
      res.redirect('/client/'+ req.params.id)
    }
    else{
      res.redirect('/dashboard')
    }
  })
});

router.get('/:id', (req, res, next) => {
  util.authCheck(req , (user) =>{
    if(user){
      var invoiceArr = [];
      dueSum = 0;
      total = 0;
      var client = seeds.pseudoClient.find(client => client.id === parseInt(req.params.id));
      seeds.invoices.forEach(function(invoice){
        if(invoice.client.id === parseInt(req.params.id)){
          invoiceArr.push(invoice);
          dueSum += invoice.balanceDue;
          total += invoice.total;
        }
      });
      res.render('client/show', {
        client: client,
        invoice: invoiceArr,
        totalDue: dueSum,
        total: total
      });
    }
    else {
      res.redirect('/dashboard');
    }
  })
})

router.delete('/delete',(req,res,next) =>{
  util.authCheck(req ,(user) =>{
    if(user){
      var ids = []
      var ids = req.body.row;
      for(var i in ids){
        for(var j in seeds.pseudoClient){
          if(ids[i] == seeds.pseudoClient[j].id){
            seeds.pseudoClient.splice(j,1);
            break;
          }
        }
      }

      res.redirect('/client');
    }
    else{
      res.redirect('/dashboard');
    }
  });
});

router.delete('/:id/delete',(req,res,next) =>{
  util.authCheck(req ,(user) =>{
    if(user){
      var ids = []
      var ids = req.body.row;
      for(var i in ids){
        for(var j in seeds.invoices){
          if(seeds.invoices[j].client.id == req.params.id)
            if(ids[i] == seeds.invoices[j].id){
              seeds.invoices.splice(j,1);
              break;
            }
        }
      }

      res.redirect('/client/' + req.params.id);
    }
    else{
      res.redirect('/dashboard');
    }
  });
});



module.exports = router;
