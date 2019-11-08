const express = require('express');
const router = express.Router();
const util = require('../modules/utility');

const seeds = require('../seeds');


<<<<<<< HEAD
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
=======
router.get('/accountant/create', (req, res, next) => {
    res.render('company/accountant/create', {
        accountant: 'Head',
        countryCode: seeds.countryCode,
        email: "gt_ams@yahoo.in"
    });
});

router.get('/accountant/edit', (req, res, next) => {

    res.render('company/accountant/edit', {
        accountant: seeds.psuedoAccountant,
        countryCode: seeds.countryCode,
    });
});

router.get('/create', (req, res, next) => {
    res.render('company/create', {
        countryCode: seeds.countryCode,
        currency: seeds.currency,
        dateFormat: seeds.dateFormat
    });
});

router.get('/edit', (req, res, next) => {


    res.render('company/edit', {
        company: seeds.pseudoCompany,
        countryCode: seeds.countryCode,
        currency: seeds.currency,
        dateFormat: seeds.dateFormat
    });
>>>>>>> 2ed36bc75acdba22ed8be379aec95324e3e59f04
});

module.exports = router;
