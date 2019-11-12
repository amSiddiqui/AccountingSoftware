const express = require("express");

const router = express.Router();
const util = require('../modules/utility');

const seeds = require('../seeds');

router.get('/create', (req, res, next) => {
    util.authCheck(req, user => {
        if (user)
        {

            res.render('vendor/create', {
                countryCode: utilData.country.countryCode,
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
      // seeds.vendor.push(vendor);

      // TODO: Push data into database using axios
      axios.post(dburl+'/client/create/'{
          token: user.token,
          accessToken: accessToken,
          vendor: vendor
      }).then(response => {

          res.render('back')
          });
      }).catch(err => {
          // console.error(err);
          res.render('error', {
              message: err.response.data
          });
      });
      // res.render('back');
    }
    else {
      res.redirect('/dashboard')
    }
  })
})

module.exports = router;
