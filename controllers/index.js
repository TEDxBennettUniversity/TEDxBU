const Detail = require('../models/details');

const renderIndex = (req, res) => {
    res.render('index');
}

const renderTeam = (req, res) => {
    res.render('trial2');
}

const renderForm = (req, res) => {
    res.render('form');
}

const registerUser = async (req, res) => {
    const detail = new Detail(req.body.details);
    await detail.save();
    res.redirect('thankyou');
}

module.exports = { renderIndex, renderTeam, renderForm, registerUser };