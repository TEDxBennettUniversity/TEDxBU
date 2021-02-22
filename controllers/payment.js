const Razorpay = require('razorpay');
const ExpressError = require('../utils/ExpressError');

const instance = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_KEY_SECRET
});

const getOrder = (req, res) => {
    try {
        const options = {
            amount: 10 * 100,
            currency: 'INR',
            payment_capture: 0
        };
    
        instance.orders.create(options, async (err, order) => {
            if (err) {
                throw new ExpressError('Something went wrong', 500);
            }
            return res.status(200).json(order);
        });
    } catch (err) {
        throw new ExpressError('Something went wrong', 500);
    };
};

const capturePayment = (req, res) => {
    try {
        return request({
            method: "POST",
            url: `https://${process.env.RAZOR_PAY_KEY_ID}:${process.env.RAZOR_PAY_KEY_SECRET}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`,
            form: {
                amount: 10 * 100,
                currency: "INR",
            },
        },
        async function (err, response, body) {
            if (err) { 
                throw new ExpressError('Something went wrong', 500);
            }
            console.log("Status:", response.statusCode);
            console.log("Headers:", JSON.stringify(response.headers));
            console.log("Response:", body);
            return res.status(200).json(body);
        });
    } catch (err) {
        throw new ExpressError('Something went wrong', 500);    
    }
}

module.exports = { getOrder, capturePayment };