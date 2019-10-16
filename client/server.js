const express =  require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const indexRouter = require("./routes/index");
const companyRouter = require('./routes/company');
const clientRouter = require('./routes/client');

const app = express();
const PORT = 3000;

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
app.use('/client', clientRouter);


if (!process.env.PORT && !process.env.IP) {
    app.listen(PORT, () => {
        console.log("Application listening at port "+PORT);
    });
}else{
    app.listen(process.env.PORT, process.env.IP, () => {
        console.log("Application listening at port "+process.env.PORT);
    });
}