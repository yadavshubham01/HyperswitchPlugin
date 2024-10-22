const request = require('supertest')
const app = require('../src/index'); // Assuming app exports the Express instance

describe('Payment Controller', () => {
    it('should create a payment successfully', async () => {
        const mockPaymentData = {
            amountPlanned: {
                centAmount: 1000,
                currencyCode: 'USD'
            },
            paymentMethodInfo: {
                method: 'creditCard'
            }
        };

        const response = await request(app)
            .post('/payments')
            .send(mockPaymentData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('paymentId');
        expect(response.body).toHaveProperty('status');
    });

    it('should handle invalid payment data', async () => {
        const invalidPaymentData = {
            paymentMethodInfo: {
                method: 'creditCard'
            }
        };

        const response = await request(app)
            .post('/payments')
            .send(invalidPaymentData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid payment request');
    });
});
