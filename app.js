const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
const ExpressError = require('./utils/ExpressError');
const indexRoutes = require('./routes/index');

const dbUrl = process.env.DB_URL || 'mongodb://192.168.0.36:27017/tedx';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).catch((err) => {
    console.log('Database connection error');
    console.log(err);
});

const db = mongoose.connection;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet({
    contentSecurityPolicy: false
}));

app.use('/', indexRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError(`Page Not Found ${req.url}`, 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    console.log(err.message);
    res.status(statusCode).render('error', { err });
});

module.exports = { app, db }
