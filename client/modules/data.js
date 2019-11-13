const config = require('../config/config');
const axios = require('axios');

console.log('Access Token in data.js: ', accessToken);

global.utilData = {
    outstandingRevenue: 20000,
    overdue: 4000,
    profit: [
        1200,
        4000,
        -500,
        100,
        2000,
        100,
    ],
    totalProfit: 5700,
    revenueStream: [
        {
            client: "Someone1",
            revenue: 2000
        },
        {
            client: "Someone2",
            revenue: 4000
        },
        {
            client: "Someone3",
            revenue: 3000
        },
        {
            client: "Someone4",
            revenue: 2500
        },
        {
            client: "Someone5",
            revenue: 4200
        }
    ],
    totalRevenue: 200000,
    spending: [
        {
            vendor: "Who1",
            spent: 5000
        },

        {
            vendor: "Who2",
            spent: 4000
        },
        {
            vendor: "Who3",
            spent: 2000
        },
        {
            vendor: "Who4",
            spent: 200
        },

        {
            vendor: "Who5",
            spent: 2400
        },

    ],
    totalSpending: 10000,
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
    console.log('All initialization complete starting server');
    require('../init');
}).catch(err => {
    console.error("Error while loading util data");
    console.log(err);
});
