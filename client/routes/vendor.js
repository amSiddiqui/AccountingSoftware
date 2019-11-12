const express = require("express");

const router = express.Router();
const util = require('../modules/utility');

const seeds = require('../seeds');

router.get('/create', (req, res, next) => {
    util.authCheck(req, user => {
        if (user)
        {
            // TODO: Use axios
            // axios.post(dburl + '/vendor/'{
            //
            // }).then(response => {
            //   var
            // })
            res.render('vendor/create', {
                countryCode: seeds.countryCode,
            });
        }
        else
        {
            res.redirect('/dashboard');
        }
    });
});

router.post('/',(req , res,next) =>{
  util.authCheck(req, user =>{
    if(user){
      vendor = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        countryCode: req.body.countryCode,
        address: {
          address1:req.body.name,
          city: req.body.city,
          state: req.body.state,
          country: req.body.country,
          pincode:req.body.pincode
        }
      }
      seeds.vendor.push(vendor);

      // TODO: Push data into database using axios
      // axios.post(dburl+'/client/create'{
      //     token: user.token,
      //     accessToken: accessToken
      //     vendor: vendor
      // }).then(response => {
      //     console.log(Vendor Added)
      //
      //     res.render('/dashboard')
      //     });
      // }).catch(error => {
      //     console.error(error);
      //     res.render('error', {
      //         message: dbErrorMsg
      //     });
      // });
      res.render('back');
    }
    else {
      res.redirect('/dashboard')
    }
  })
})

module.exports = router;
