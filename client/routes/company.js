const express = require('express');
const router = express.Router();
const util = require('../modules/utility');


router.get('/accountant/create',util.validateUser({next:true}), (req, res) => {
	
	res.render('company/createAccountant', {
		accountant: 'Head',
		countryCode: ['+91', '+88', '+65'],
		email: "gt_ams@yahoo.in"
	});
});

router.get('/create',util.validateUser({next:true}), (req, res) => {

	res.render('company/createCompany', {
        	countryCode: ['+91', '+88', '+65'],
        	currency: ['$ (USD)', '€ (EUR)', '£ (GBP)', '₹ (INR)'],
        	dateFormat: ['dd/mm/yyy', 'mm/dd/yyyy', 'yyyy/mm/dd']
    	});
});

module.exports = router;
