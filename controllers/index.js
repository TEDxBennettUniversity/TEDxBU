const Detail = require('../models/details');
const Subscription = require('../models/subscription');
const Contact = require('../models/contacts');
const ExpressError = require('../utils/ExpressError');
const mailer = require('../utils/mailer');

const validateTier = (tier) => {
    if (!tier) {
        throw new ExpressError('Please mention a tier', 400);
    }
    let heading = '';
    if (tier === 'basic_pass') heading = 'Basic Pass';
    else if (tier === 'early_bird') heading = 'Early Bird';
    else if (tier === 'premium_pass') heading = 'Premium Pass';
    else {
        throw new ExpressError('Invalid Tier', 400);
    }
    return heading;
}

const renderIndex = (req, res) => {
    res.render('index');
}

const renderTeam = (req, res) => {
    res.render('trial2');
}

const renderForm = (req, res) => {
    const { tier } = req.query;
    const heading = validateTier(tier);
    res.render('form', { heading, tier });
}

const registerUser = async (req, res) => {
    const detail = new Detail(req.body.details);
    const { tier } = req.query;
    detail.tier = validateTier(tier);
    await detail.save();
    res.redirect(`/payment?tier=${tier}`);
}

const renderPayment = (req, res) => {
    const { tier } = req.query;
    const heading = validateTier(tier);
    res.render('samplepayment', { heading });
}

const userSubscribe = async (req, res) => {
    const subEmail = new Subscription(req.body);
    await subEmail.save();
    res.redirect('/');
}

const contactTeam = async (req, res) => {
    const contact = new Contact(req.body.contact);
    await contact.save();

    const mailBody = req.body.contact;
    const mailOptions = {
        from: process.env.CONTACT_MAIL_ID,
        to: 'tedxbennettuniversity@gmail.com',
        subject: `TedxBennett: ${mailBody.subject}`,
        html: `<p>Name: ${mailBody.name}</p><p>Email: ${mailBody.email}</p><p>Phone: ${mailBody.number}</p><p>Message: ${mailBody.message}</p>`
    };

    mailer.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent:' + info.response);
        }
    });

    res.redirect('/');
}

module.exports = { renderIndex, renderTeam, renderForm, registerUser, renderPayment, userSubscribe, contactTeam };