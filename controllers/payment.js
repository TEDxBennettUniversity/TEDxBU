const Razorpay = require('razorpay');
const ExpressError = require('../utils/ExpressError');

const instance = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_KEY_SECRET
});

const getOrder = (req, res) => {
    var options = {  
        amount: req.session.cost,
        currency: "INR", 
    };
    
    instance.orders.create(options, function(err, order) {
        console.log(order);
        res.json(order);
    });
};

const capturePayment = (req, res) => {
    // console.log(req);
    res.render('thankyou');
    res.send(req.body.razorpay_payment_id);
}

module.exports = { getOrder, capturePayment };