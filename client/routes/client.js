const express = require("express");
const router = express.Router();
const util = require('../modules/utility');
const seeds = require('../seeds');
const bodyParser = require('body-parser');
const app = express();
const config = require('../config/config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



router.get('/', (req, res, next) => {
  util.authCheck(req, (user) =>{

    if(user){
      var outstanding =0;
      var total = 0;
      //TODO: fetch total ,outstanding,overdue,draft
      //TODO: Use axios
      seeds.pseudoClient.forEach(function(client){
        outstanding += client.amountDue;
        total += client.total;
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
      //TODO: Fetch all contryCode set from database
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


      //TODO: fetch auto-generate ID
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
      // TODO: Push data into database using axios
      axios.post(config.url+'/client/create/', {
          token: user.token,
          accessToken: accessToken,
          client: params
      }).then(response => {
          console.log('Client Added')

          res.render('/client')
          }).catch(err => {
          console.error(err);
          res.render('error', {
              message: err.response.data
          });
      });
      clientID++;//temporary way to increment id
      seeds.pseudoClient.push(params);
      res.redirect('/client');
    }
    else{
      res.redirect('/dashboard');
    }
  });
});


router.get('/:id/edit/', (req, res, next) => {
  util.authCheck(req, (user) =>{
    if(user){
      // TODO:Get request using Axios
      // axios.get(config.url + '/client/clientID',{
      //   token: user.token,
      //   accessToken: accessToken,
      // }).then(response => {
      //   var client = response.data.client;

      // TODO: Fetch countryCode associated with the respective clients

      //   var countryCode = response.data.countryCode;
      //   res.render('client/edit',{
      //     client:client,
      //     countryCode: countryCode,
      //   })
      // }).catch(error =>{
      //   console.log(error);
      //   res.redirect('error',{message: error});
      // });

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

      axios.post(config.url + `/client/${req.params.id}/`, {
        token: user.token,
        accessToken: accessToken,
      }).then(res1 => {
          res1 = res1.data;
          for(var i in res1){
            if(res1[i].id === req.params.id){
              res1[i].firstName = req.body.firstName;
              res1[i].lastName= req.body.lastName;
              res1[i].countryCode= req.body.countryCode;
              res1[i].phone= req.body.phone;
              res1[i].email= req.body.email;
              res1[i].address.address1= req.body.address1;
              res1[i].address.city= req.body.city;
              res1[i].address.state= req.body.state;
              res1[i].address.country= req.body.country;
              res1[i].address.pincode= req.body.pincode;
              res1[i].lateFeeRate= req.body.lateFeeRate;
              break;
            }
          }

<<<<<<< HEAD
          axios.post(dburl + `/client/${req.params.id}/update/`,{
            token: user.token.
=======
          axios.post(config.url + `/client/${req.params.id}/update`,{
            token: user.token,
>>>>>>> 3acd894862038264e12e01f637cc98b723366103
            accessToken: accessToken,
            client: res1,
          }).then(response =>{
            console.log('client updated');
            res.render('/client/'+req.params.id);
          }).catch(error => {
            console.log(error);
            res.render('/error',{message:dbErrorMsg});
          });
        }

      );
    }
      // for(var i in seeds.pseudoClient){
      //   if(seeds.pseudoClient[i].id == req.params.id){
      //     seeds.pseudoClient[i].firstName = req.body.firstName;
      //     seeds.pseudoClient[i].lastName= req.body.lastName;
      //     seeds.pseudoClient[i].countryCode= req.body.countryCode;
      //     seeds.pseudoClient[i].phone= req.body.phone;
      //     seeds.pseudoClient[i].email= req.body.email;
      //     seeds.pseudoClient[i].address.address1= req.body.address1;
      //     seeds.pseudoClient[i].address.city= req.body.city;
      //     seeds.pseudoClient[i].address.state= req.body.state;
      //     seeds.pseudoClient[i].address.country= req.body.country;
      //     seeds.pseudoClient[i].address.pincode= req.body.pincode;
      //     seeds.pseudoClient[i].lateFeeRate= req.body.lateFeeRate;
      //     break;
      //   }
      // }

    else{
      res.redirect('/dashboard')
    }
  });
});

router.get('/:id', (req, res, next) => {
  util.authCheck(req , (user) =>{
    if(user){
      var invoiceArr = [];
      dueSum = 0;
      total = 0;
      //TODO: fetch overdue for of client with clientID
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
  });
});

router.delete('/delete',(req,res,next) =>{
  util.authCheck(req ,(user) =>{
    if(user){
<<<<<<< HEAD
      var ids = []
      var ids = req.body.row;
      // for(var i in ids){
      //   for(var j in seeds.pseudoClient){
      //     if(ids[i] == seeds.pseudoClient[j].id){
      //       seeds.pseudoClient.splice(j,1);
      //       break;
      //     }
      //   }
      // }
=======
      var ids = [];
      ids = req.body.row;
      for(var i in ids){
        for(var j in seeds.pseudoClient){
          if(ids[i] == seeds.pseudoClient[j].id){
            seeds.pseudoClient.splice(j,1);
            break;
          }
        }
      }
>>>>>>> 3acd894862038264e12e01f637cc98b723366103

      axios.post(config.url + "/client/delete/", {
        token: user.token,
        accessToken: accessToken,
        client: client
      })
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err);
      });

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
      var ids = [];
      ids = req.body.row;

<<<<<<< HEAD
      axios.post(dburl + 'invoice/delete/', {
          token:user.token,
          accessToken:accessToken,
          invoices: ids,
      }).then( response =>{
        res.render('/client' + req.params.id);
      }).catch(err =>{
        res.render('error',{
          message:err.response.data,
        });
      });
=======
      // TODO: Delete from frontend side
      // axios.post(config.url + 'client/delete', {
      //     token:user.token,
      //     accessToken:accessToken,
      //     invoices: ids,
      // }).then( response =>{
      //   res.render('/client' + req.params.id);
      // }).catch(err =>{
      //   res.render('error',{
      //     message:err.response.data,
      //   });
      // });
>>>>>>> 3acd894862038264e12e01f637cc98b723366103

      // for(var i in ids){
      //   for(var j in seeds.invoices){
      //     if(seeds.invoices[j].client.id == req.params.id)
      //       if(ids[i] == seeds.invoices[j].id){
      //         seeds.invoices.splice(j,1);
      //         break;
      //       }
      //   }
      // }

      // axios.post(config.url + "/client/delete", {
      //   token: user.token,
      //   accessToken: accessToken,
      //   client: client
      // })
      // .then(response => {
      //   console.log(response)
      // })
      // .catch(err => {
      //   console.log(err);
      // });

      // res.render('/client/' + req.params.id);
    }
    else{
      res.redirect('/dashboard');
    }
  });
});



module.exports = router;
