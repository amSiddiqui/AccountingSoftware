const express = require("express");

const router = express.Router();

const seeds = require('../seeds');


router.get('/', (req, res, next) => {
    res.render('client/client',{
      clients: seeds.pseudoClient,
    });
});

router.get('/create', (req, res, next) => {
  res.render('client/create', {
    countryCode: seeds.countryCode,
  });
});
router.post('/', (req, res) => {
  var params = {
    id: '000001',
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    countryCode: req.body.countryCode,
    phone: req.body.phone,
    email: req.body.email,
    address1: req.body.address1,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    pincode: req.body.pincode,
    lateFeeRate: req.body.lateFeeRate,
  }
  seeds.pseudoClient.push(params);
  res.redirect('/client');
});


router.get('/:id/edit/', (req, res, next) => {
  var client = seeds.pseudoClient.find(client => client.id === req.params.id);
  res.render('client/edit', {
    client: client,
    countryCode: seeds.countryCode,
  });
});

router.put('/:id',(req,res) => {
  for(var i in seeds.pseudoClient){
    if(seeds.pseudoClient[i].id === req.params.id){
      seeds.pseudoClient[i].firstName = req.body.firstName;
      seeds.pseudoClient[i].lastName= req.body.lastName;
      seeds.pseudoClient[i].countryCode= req.body.countryCode;
      seeds.pseudoClient[i].phone= req.body.phone;
      seeds.pseudoClient[i].email= req.body.email;
      seeds.pseudoClient[i].address1= req.body.address1;
      seeds.pseudoClient[i].city= req.body.city;
      seeds.pseudoClient[i].state= req.body.state;
      seeds.pseudoClient[i].country= req.body.country;
      seeds.pseudoClient[i].pincode= req.body.pincode;
      seeds.pseudoClient[i].lateFeeRate= req.body.lateFeeRate;
      break;
    }
  }
  res.redirect('/client/'+ req.params.id)
});

router.get('/:id', (req, res, next) => {
  var client = seeds.pseudoClient.find(client => client.id === req.params.id);
    res.render('client/show', {
        client: client,
    });
});



module.exports = router;
