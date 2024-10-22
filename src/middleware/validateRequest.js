const validatePaymentRequest = (req, res, next) => {
    const { amountPlanned, paymentMethodInfo } = req.body;
    if (!amountPlanned || !paymentMethodInfo) {
        return res.status(400).json({ error: 'Invalid payment request' });
    }
    next();
};

module.exports = {
    validatePaymentRequest,
};
