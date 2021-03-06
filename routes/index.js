const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const indexDetail = require('../controllers/index');
const paymentFuncs = require('../controllers/payment');
const validation = require('../utils/middleware');

router.route('/')
    .get(indexDetail.renderIndex);

router.route('/subscribe')
    .post(validation.validateSubscription, catchAsync(indexDetail.userSubscribe));

router.route('/contact')
    .post(validation.validateContact, catchAsync(indexDetail.contactTeam));

router.route('/team')
    .get(indexDetail.renderTeam);

// router.route('/register')
//     .get(indexDetail.renderForm)
//     .post(validation.validateDetails, catchAsync(indexDetail.registerUser));

// router.route('/payment')
//     .get(indexDetail.renderPayment);

// router.route('/confirmation')
//     .get(indexDetail.renderSS);

// router.route('/confirmed')
//     .get(indexDetail.renderThanks)

// router.route('/order')
//     .get(paymentFuncs.getOrder);

// router.route('/capture')
//     .post(paymentFuncs.capturePayment);

module.exports = router;