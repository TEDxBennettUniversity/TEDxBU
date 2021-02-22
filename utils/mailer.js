const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.CONTACT_MAIL_ID,
        pass: process.env.CONTACT_MAIL_PASS
    }
});

const transporter2 = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TEDX_MAIL_ID,
        pass: process.env.TEDX_MAIL_PASS
    }
})

module.exports = { transporter, transporter2 };