const express =  require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const clientConfig = require('./config/config').clientConfig;

const indexRouter = require("./routes/index");
const companyRouter = require('./routes/company');

const app = express();
const PORT = process.env.PORT ? process.env.PORT : clientConfig.port;
const IP = process.env.IP ? process.env.IP : clientConfig.IP;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static/public')));

app.use((req, res, next) => {
    res.locals.user = {
        username: "theKeySpammer",
        company: "team 11"
    };
    next();
});

app.use('/', indexRouter);
app.use('/company', companyRouter);

app.listen(PORT, IP, () => {
    console.log("Application listening at port "+ PORT);
    console.log(`http://${IP}:${PORT}`);
});
