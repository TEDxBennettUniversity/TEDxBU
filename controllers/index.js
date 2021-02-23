const Detail = require('../models/details');
const Subscription = require('../models/subscription');
const Contact = require('../models/contacts');
const ExpressError = require('../utils/ExpressError');
const { transporter, transporter2 } = require('../utils/mailer');

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
    req.session.name = detail.name;
    req.session.email = detail.email;
    req.session.phone = detail.phone;
    const { tier } = req.query;
    detail.tier = validateTier(tier);
    await detail.save();
    res.redirect(`/payment?tier=${tier}`);
}

const renderPayment = (req, res) => {
    const { tier } = req.query;
    const heading = validateTier(tier);
    let cost = 0
    switch (heading) {
        case 'Basic Pass': cost = 150;
            break;
        case 'Early Bird': cost = 100;
            break;
        case 'Premium Pass': cost = 200;
            break;
        default:
            throw new ExpressError('Something went wrong');
    };
    const variables = {
        heading,
        cost,
        name: req.session.name,
        email: req.session.email,
        phone: req.session.phone
    };
    res.render('samplepayment', variables);
}

const userSubscribe = async (req, res) => {
    const subEmail = new Subscription(req.body);
    await subEmail.save();

    const { email } = req.body;
    const mailOptions = {
        from: process.env.TEDX_MAIL_ID,
        to: email,
        subject: 'TEDx Bennett University Purchase Confirmation',
        html: `<p>Dear Mr/Miss</p><p>Thank you for subscribing to our mailing list.</p><p>Behind every success story there is a lifetime worth of struggle that never meets the public eye. Most people in the society look at people that are thriving in their fields and say ‘they got lucky’ or ‘it was handed to them’, but nobody looks for the struggle they had to encounter. Through TEDx Bennett University, we hope to bring to light some of these background stories.</p><p>Stay tuned to our website for more information and latest updates.</p><h1><span style="color: #e62b1e;">TED<sup>x</sup></span>BennettUniversity</h1>`
    };

    transporter2.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent:' + info.response);
        }
    });

    res.redirect('/');
}

const contactTeam = async (req, res) => {
    const contact = new Contact(req.body.contact);
    await contact.save();

    const mailBody = req.body.contact;
    const mailOptions = {
        from: process.env.CONTACT_MAIL_ID,
        to: process.env.TEDX_MAIL_ID,
        subject: `TedxBennett: ${mailBody.subject}`,
        html: `<p>Name: ${mailBody.name}</p><p>Email: ${mailBody.email}</p><p>Phone: ${mailBody.number}</p><p>Message: ${mailBody.message}</p>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent:' + info.response);
        }
    });

    res.redirect('/');
}

module.exports = { renderIndex, renderTeam, renderForm, registerUser, renderPayment, userSubscribe, contactTeam };