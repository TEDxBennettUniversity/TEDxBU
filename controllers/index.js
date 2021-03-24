const Detail = require('../models/details');
const Subscription = require('../models/subscription');
const Contact = require('../models/contacts');
const Address = require('../models/addresses');
const ExpressError = require('../utils/ExpressError');
const { transporter, transporter2 } = require('../utils/mailer');

const validateTier = (tier) => {
    if (!tier) {
        throw new ExpressError('Please mention a tier', 400);
    }
    let heading = '';
    if (tier === 'basic_pass') heading = 'Basic Pass';
    else if (tier === 'discounted_pass') heading = 'Discounted Pass';
    // else if (tier === 'premium_pass') heading = 'Premium Pass';
    else {
        throw new ExpressError('Invalid Tier', 400);
    }
    return heading;
}

const renderIndex = async (req, res) => {
    const ip = req.ip;
    const d = new Date();
    const date = d.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' })
    const address = new Address({ ip, date });
    await address.save();
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
    detail.orderID = 'orderid_' + new Date().getTime().toString().substr(5) + Math.floor(Math.random() * 1000)
    req.session.name = detail.name;
    req.session.email = detail.email;
    req.session.phone = detail.phone;
    const { tier } = req.query;
    detail.tier = validateTier(tier);
    const savedDetail = await detail.save();

    req.session.orderid = savedDetail.orderID;

    const mailOptions = {
        from: process.env.CONTACT_MAIL_ID,
        to: process.env.TEDX_MAIL_ID,
        subject: `TedxBennett: Registration`,
        html: `<p>Order ID: ${ savedDetail.orderID }</p>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent:' + info.response);
        }
    });

    res.redirect(`/payment?tier=${tier}`);
}

const renderPayment = (req, res) => {
    const { tier } = req.query;
    const heading = validateTier(tier);
    let cost = 0
    switch (heading) {
        case 'Basic Pass': cost = 250 * 100;
            break;
        case 'Discounted Pass': cost = 150 * 100;
            break;
        // case 'Premium Pass': cost = 200 * 100;
        //     break;
        default:
            throw new ExpressError('Something went wrong');
    };
    req.session.cost = cost;
    const variables = {
        heading,
        cost,
        name: req.session.name,
        email: req.session.email,
        phone: req.session.phone,
        tier: heading.toLowerCase().replace(' ', '_')
    };
    res.render('payment', variables);
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

    res.render('thankyou', { msg1: 'You have been added to our mailing list', msg2: '' });
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

    res.render('thankyou', { msg1: 'Glad that you reached out to us!', msg2: "We'll get back to you soon." });
}

const renderThanks = (req, res) => {
    res.render('thankyou', { msg1: 'Payment Successful.', msg2: "You'll get a mail regarding your order soon!" });
}

const renderSS = (req, res) => {
    const { tier } = req.query;
    const heading = validateTier(tier);
    const orderid = req.session.orderid;
    res.render('screenshot', { heading, orderid });
}

module.exports = { renderIndex, renderTeam, renderForm, registerUser, renderPayment, userSubscribe, contactTeam, renderThanks, renderSS };