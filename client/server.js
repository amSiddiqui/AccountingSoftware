const express =  require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const clientConfig = require('./config/config').clientConfig;

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



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static/public')));

// Global variables
global.dburl = process.env.DBURL;
global.tempProfile = null;

app.use((req, res, next) => {
    res.locals.user = {
        username: "theKeySpammer",
        company: "team 11"
    };
    next();
});

app.use('/', indexRouter);
app.use('/company', companyRouter);
app.use('/client', clientRouter);
app.use('/vendor', vendorRouter);
app.use('/report', reportRouter);
app.use('/expense', expenseRouter);
app.use('/invoice', invoiceRouter);

app.listen(PORT, IP, () => {
    console.log("Application listening at port "+ PORT);
    console.log(`http://${IP}:${PORT}`);
});