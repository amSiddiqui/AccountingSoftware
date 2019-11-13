const config = require('../config/config');
const axios = require('axios');

console.log('Access Token in data.js: ', accessToken);

global.utilData = {
    unbilledTimes: [
        {
            client: "late1",
            time: 8,
            due: 200
        },
        {
            client: "late2",
            time: 4,
            due: 100
        },
        {
            client: "late3",
            time: 1,
            due: 90
        },
        {
            client: "late4",
            time: 8,
            due: 200
        },
        {
            client: "late5",
            time: 4,
            due: 100
        },

    ],
};

(async () => {
    try {
        utilData.quotes =  (await axios.post(config.url+'/util/quote/', {
            accessToken
        })).data;


        utilData.country =  (await axios.post(config.url+'/util/country/', {
            accessToken
        })).data;


        utilData.phone_code =  (await axios.post(config.url+'/util/phone_code/', {
            accessToken
        })).data;


        utilData.datefmt =  (await axios.post(config.url+'/util/datefmt/', {
            accessToken
        })).data;


        utilData.currency =  (await axios.post(config.url+'/util/currency/', {
            accessToken
        })).data;

        

    }
    catch(err) {
        throw new Error(err.response.data);
    }
})().then(() => {

    // Preprocess Currency data
    tempCurrency = utilData.currency;
    curSymbol = [];
    for (let index = 0; index < tempCurrency.symbol.length; index++) {
        const element = tempCurrency.symbol[index];
        const currency = tempCurrency.currency[index];
        curSymbol.push(element+' '+currency);
    }
    utilData.currency.symbol = curSymbol;

    for (let index = 0; index < utilData.phone_code.ISD.length; index++) {
        utilData.phone_code.ISD[index] = '+'+utilData.phone_code.ISD[index];   
    }

    console.log('All initialization complete starting server');
    require('../init');
}).catch(err => {
    console.error("Error while loading util data");
    console.log(err);
});
