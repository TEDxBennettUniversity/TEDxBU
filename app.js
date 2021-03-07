const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const session = require('express-session');
const MongoDBStore = require('connect-mongo').default;
const path = require('path');
const ExpressError = require('./utils/ExpressError');
const indexRoutes = require('./routes/index');

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).catch((err) => {
    console.log('Database connection error');
});

const db = mongoose.connection;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}));
app.use(helmet({
    contentSecurityPolicy: false
}));

app.use('/healthCheck', (req, res) => {
    res.sendStatus(200);
});

app.use(session({
    store: MongoDBStore.create({
        mongoUrl: dbUrl,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1 * 60 * 60 * 1000
    }
}));

app.use('/', indexRoutes);
app.use('/healthCheck', (req, res) => {
    res.sendStatus(200);
});

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
