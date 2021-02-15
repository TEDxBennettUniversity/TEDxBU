const Detail = require('../models/details');
const ExpressError = require('../utils/ExpressError');

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

module.exports = { renderIndex, renderTeam, renderForm, registerUser, renderPayment };