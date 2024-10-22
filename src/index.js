const express = require('express');
     const bodyParser = require('body-parser');
     const dotenv = require('dotenv');
     const winston = require('winston');
     const paymentController = require('./Controllers/paymentController');
     const notificationController = require('./Controllers/notificationController');
     const determineProjectConfig = require('./middlewares/multiTenancy');
     const { validatePaymentRequest } = require('./middleware/validateRequest');



     dotenv.config();

     const app = express();
     const port = process.env.PORT || 3000;

     // Middleware
     app.use(bodyParser.json());
     app.use('/payments', determineProjectConfig);
     app.use('/webhooks/hyperswitch', determineProjectConfig);


     // Logger setup
     const logger = winston.createLogger({
         level: 'info',
         format: winston.format.json(),
         transports: [
             new winston.transports.Console(),
         ],
     });
     
     app.post('/payments',validatePaymentRequest, paymentController.createPayment);
     app.post('/payments/update', paymentController.updatePayment);
     app.post('/webhooks/hyperswitch', notificationController.handleWebhook);
     // Basic route
     app.get('/', (req, res) => {
         res.send('Hyperswitch - commercetools integration is running');
     });

     // Start the server
     app.listen(port, () => {
         logger.info(`Server is running on port ${port}`);
     });
