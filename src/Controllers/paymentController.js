const axios = require('axios');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

dotenv.config();

// Function to handle payment creation
const createPayment = async (req, res) => {
    try {
        const paymentData = req.body;
        logger.info('Received payment creation request', paymentData);

        // Call Hyperswitch API to create a payment
        const response = await axios.post('https://api.hyperswitch.io/payments', {
            amount: paymentData.amountPlanned.centAmount,
            currency: paymentData.amountPlanned.currencyCode,
            paymentMethod: paymentData.paymentMethodInfo.method,
            // Additional parameters as required by Hyperswitch
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.HYPERSWITCH_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        // Update commercetools payment object with Hyperswitch response data
        const hyperswitchPayment = response.data;
        logger.info('Payment created successfully with Hyperswitch', hyperswitchPayment);

        res.status(200).json({
            paymentId: hyperswitchPayment.id,
            status: hyperswitchPayment.status,
        });
    } catch (error) {
        logger.error('Error creating payment', error);
        res.status(500).json({ error: 'Failed to create payment' });
    }
};

const updatePayment = async (req, res) => {
  try {
      const paymentData = req.body;
      logger.info('Received payment update request', paymentData);

      const { action } = paymentData; // Determine the type of update (capture, refund, etc.)

      let hyperswitchEndpoint = '';
      switch (action) {
          case 'capture':
              hyperswitchEndpoint = `/payments/${paymentData.paymentId}/capture`;
              break;
          case 'refund':
              hyperswitchEndpoint = `/payments/${paymentData.paymentId}/refund`;
              break;
          default:
              res.status(400).json({ error: 'Unsupported action type' });
              return;
      }

      // Call Hyperswitch API to perform the action
      const response = await axios.post(`https://api.hyperswitch.io${hyperswitchEndpoint}`, {
          amount: paymentData.amount,
      }, {
          headers: {
              'Authorization': `Bearer ${process.env.HYPERSWITCH_API_KEY}`,
              'Content-Type': 'application/json',
          }
      });

      const hyperswitchResponse = response.data;
      logger.info(`Payment ${action} successful`, hyperswitchResponse);

      res.status(200).json(hyperswitchResponse);
  } catch (error) {
      logger.error('Error updating payment', error);
      res.status(500).json({ error: 'Failed to update payment' });
  }
};


// Export controller functions
module.exports = {
    createPayment,
    updatePayment
};


