const logger = require('../utils/logger');
const axios = require('axios');

const verifyWebhook = (req) => {
  const receivedSignature = req.headers['x-hyperswitch-signature'];
  const computedSignature = computeSignature(req.body);

  return receivedSignature === computedSignature;
};

const processedEvents = new Set(); // This should be replaced with a proper database/storage in a real implementation

// Dummy signature computation function (update this based on Hyperswitch documentation)
const computeSignature = (body) => {
  // Here you should compute the signature based on your secret key
  // This is just a placeholder for demonstration purposes
  return 'computed-signature-based-on-body-and-secret';
};


// Function to handle incoming webhooks
const handleWebhook = async (req, res) => {
    try {
      if (!verifyWebhook(req)) {
        logger.error('Webhook verification failed');
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const webhookData = req.body;
      const { eventId } = webhookData;

      // Idempotency check
      if (processedEvents.has(eventId)) {
          logger.info('Duplicate webhook, ignoring', eventId);
          return res.status(200).json({ message: 'Duplicate webhook ignored' });
        }

      // Process webhook normally
       processedEvents.add(eventId);
  
        logger.info('Received webhook notification', webhookData);

        const { event, paymentId, status } = webhookData;

        // Verify that the necessary fields are present
        if (!event || !paymentId || !status) {
            logger.error('Invalid webhook data');
            return res.status(400).json({ error: 'Invalid webhook data' });
        }

        // Update the corresponding payment in commercetools
        await updateCommercetoolsPayment(paymentId, status);

        logger.info('Payment status updated successfully in commercetools');
        res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
        logger.error('Error handling webhook', error);
        res.status(500).json({ error: 'Failed to process webhook' });
    }
};

// Function to update payment status in commercetools
const updateCommercetoolsPayment = async (paymentId, status) => {
    try {
        // Make a request to update the payment status in commercetools
        const commercetoolsResponse = await axios.post(
            `https://api.commercetools.com/YOUR_PROJECT_KEY/payments/${paymentId}`,
            {
                version: 1, // Replace with actual payment version
                actions: [
                    {
                        action: 'changeTransactionState',
                        state: status,
                    },
                ],
            },
            {
                headers: {
                    'Authorization': `Bearer YOUR_COMMERCETOOLS_API_TOKEN`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return commercetoolsResponse.data;
    } catch (error) {
        logger.error('Error updating payment in commercetools', error);
        throw new Error('Failed to update payment status');
    }
};

// Export the webhook handler
module.exports = {
    handleWebhook,
};
