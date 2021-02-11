const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const indexDetail = require('../controllers/index');
const { validateDetails } = require('../utils/middleware');

router.route('/')
    .get(indexDetail.renderIndex);

router.route('/team')
    .get(indexDetail.renderTeam);

router.route('/register')
    .get(indexDetail.renderForm)
    .post(validateDetails, catchAsync(indexDetail.registerUser));

module.exports = router;