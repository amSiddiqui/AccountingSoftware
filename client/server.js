const Authentication = require('./modules/auth');
const auth = new Authentication();

let accessToken = null;
auth.conn().then(res => {
    global.accessToken = res.accessToken;
    global.lastInvoiceId = parseInt(res.lastInvoiceId);
    require('./modules/data');
}).catch(err => {
    console.log(err);
});
