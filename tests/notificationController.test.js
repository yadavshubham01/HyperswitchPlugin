
const request = require('supertest')
const app = require('../src/index');

describe('Notification Controller', () => {
    it('should process webhook successfully', async () => {
        const mockWebhookData = {
            eventId: '123456',
            event: 'payment_succeeded',
            paymentId: 'payment_123',
            status: 'Succeeded'
        };

        const response = await request(app)
            .post('/webhooks/hyperswitch')
            .send(mockWebhookData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Webhook processed successfully');
    });

    it('should handle duplicate webhook events', async () => {
        const mockWebhookData = {
            eventId: '123456',
            event: 'payment_succeeded',
            paymentId: 'payment_123',
            status: 'Succeeded'
        };

        await request(app)
            .post('/webhooks/hyperswitch')
            .send(mockWebhookData);

        const response = await request(app)
            .post('/webhooks/hyperswitch')
            .send(mockWebhookData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Duplicate webhook ignored');
    });
});
