const express =  require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const clientConfig = require('./config/config').clientConfig;
const config = require('./config/config');
const indexRouter = require("./routes/index");
const companyRouter = require('./routes/company');
const clientRouter = require('./routes/client');
const vendorRouter = require('./routes/vendor');
const reportRouter = require('./routes/report');
const expenseRouter = require('./routes/expense');
const invoiceRouter = require('./routes/invoice');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT ? process.env.PORT : clientConfig.port;
const IP = process.env.IP ? process.env.IP : clientConfig.IP;
const methodOverride = require('method-override');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static/public')));

console.log('Access Token: ', accessToken);
console.log('Util data: ', utilData);


//for PUT and DELETE requests
app.use(methodOverride("_method"));

// Global variables
global.tempProfile = null;
global.dbErrorMsg = "Database not responding try again later";
global.cookieOpt = {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
};


app.use((req, res, next) => {
    res.locals.user = req.cookies.user;
    next();
});

app.use('/', indexRouter);
app.use('/company', companyRouter);
app.use('/client', clientRouter);
app.use('/vendor', vendorRouter);
app.use('/report', reportRouter);
app.use('/expense', expenseRouter);
app.use('/invoice', invoiceRouter);

app.get('/*',(req,res)=>{
    return res.render('error',{message:'404 Page Not Found'})
})

app.listen(PORT, IP, () => {
    console.log("Application listening at port "+ PORT);
    console.log(`http://${IP}:${PORT}`);
});
