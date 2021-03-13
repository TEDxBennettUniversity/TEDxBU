// Not needed anymore :(
    
const Razorpay = require('razorpay');
const crypto = require('crypto');
const ExpressError = require('../utils/ExpressError');
const Detail = require('../models/details');

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
        req.session.order_id = order.id;
        res.json(order);
    });
};

const capturePayment = async (req, res) => {
    // console.log(req);
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    if (razorpay_payment_id) {
        const generated_signature = crypto.createHmac('sha256', process.env.RAZOR_PAY_KEY_SECRET)
                                        .update(req.session.order_id + "|" + razorpay_payment_id)
                                        .digest('hex');
        if (generated_signature === razorpay_signature) {
            const details = await Detail.findOne({ 'name': req.session.name, 'email': req.session.email, 'phone': req.session.phone });
            details.paid = true;
            details.paymentID = razorpay_payment_id;
            details.orderID = razorpay_order_id;
            await details.save();
            res.render('thankyou', { msg1: 'Payment Successful.', msg2: "You'll get a mail regarding your order soon!" });
        } else {
            throw new ExpressError('Source not authentic', 400);
        }       
    } else {
        throw new ExpressError('Something went wrong', 400);
    }
}

module.exports = { getOrder, capturePayment };