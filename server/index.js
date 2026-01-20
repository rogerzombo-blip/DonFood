/**
 * Stripe Payment Server
 * Backend API for processing payments with Stripe
 */

import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16'
});

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// ============================================
// ROUTES
// ============================================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        stripe: !!process.env.STRIPE_SECRET_KEY
    });
});

/**
 * Get Stripe publishable key
 * Frontend uses this to initialize Stripe.js
 */
app.get('/api/config', (req, res) => {
    res.json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
});

/**
 * Create a Payment Intent
 * This is the core of Stripe payments - creates an intent to charge
 */
app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'usd', metadata = {} } = req.body;

        // Validate amount
        if (!amount || amount < 50) {
            return res.status(400).json({
                error: 'Invalid amount. Minimum is $0.50 USD'
            });
        }

        // Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount), // Amount in cents
            currency: currency.toLowerCase(),
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                ...metadata,
                integration: 'sabores-unidos',
                created_at: new Date().toISOString()
            }
        });

        console.log(`✅ Payment Intent created: ${paymentIntent.id} for $${(amount / 100).toFixed(2)}`);

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency
        });

    } catch (error) {
        console.error('❌ Error creating payment intent:', error);
        res.status(500).json({
            error: error.message || 'Failed to create payment intent'
        });
    }
});

/**
 * Confirm Payment Intent
 * Called after the client confirms the payment
 */
app.post('/api/confirm-payment', async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({ error: 'Payment Intent ID required' });
        }

        // Retrieve the payment intent to check its status
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            console.log(`✅ Payment confirmed: ${paymentIntentId}`);

            res.json({
                success: true,
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                receiptEmail: paymentIntent.receipt_email,
                metadata: paymentIntent.metadata
            });
        } else {
            res.json({
                success: false,
                status: paymentIntent.status,
                message: `Payment status: ${paymentIntent.status}`
            });
        }

    } catch (error) {
        console.error('❌ Error confirming payment:', error);
        res.status(500).json({
            error: error.message || 'Failed to confirm payment'
        });
    }
});

/**
 * Get Payment Intent details
 */
app.get('/api/payment-intent/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const paymentIntent = await stripe.paymentIntents.retrieve(id);

        res.json({
            id: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: paymentIntent.status,
            created: paymentIntent.created,
            metadata: paymentIntent.metadata
        });

    } catch (error) {
        console.error('❌ Error retrieving payment intent:', error);
        res.status(500).json({
            error: error.message || 'Failed to retrieve payment intent'
        });
    }
});

/**
 * Webhook endpoint for Stripe events
 * Configure this URL in your Stripe Dashboard
 */
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (webhookSecret) {
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } else {
            event = req.body;
        }
    } catch (err) {
        console.error('❌ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle specific event types
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`💰 Payment succeeded: ${paymentIntent.id}`);
            // TODO: Fulfill the order, send confirmation email, etc.
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log(`❌ Payment failed: ${failedPayment.id}`);
            // TODO: Notify customer of failure
            break;

        case 'charge.refunded':
            const refund = event.data.object;
            console.log(`↩️ Refund processed: ${refund.id}`);
            break;

        default:
            console.log(`📨 Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
});

/**
 * Create a refund
 */
app.post('/api/refund', async (req, res) => {
    try {
        const { paymentIntentId, amount, reason } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({ error: 'Payment Intent ID required' });
        }

        const refundParams = {
            payment_intent: paymentIntentId,
            reason: reason || 'requested_by_customer'
        };

        // Partial refund if amount specified
        if (amount) {
            refundParams.amount = Math.round(amount);
        }

        const refund = await stripe.refunds.create(refundParams);

        console.log(`↩️ Refund created: ${refund.id}`);

        res.json({
            success: true,
            refundId: refund.id,
            amount: refund.amount,
            status: refund.status
        });

    } catch (error) {
        console.error('❌ Error creating refund:', error);
        res.status(500).json({
            error: error.message || 'Failed to create refund'
        });
    }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🍽️  Sabores Unidos Payment Server                        ║
║                                                            ║
║   Server running on: http://localhost:${PORT}               ║
║                                                            ║
║   Endpoints:                                               ║
║   • GET  /api/health              - Health check           ║
║   • GET  /api/config              - Get Stripe config      ║
║   • POST /api/create-payment-intent - Create payment       ║
║   • POST /api/confirm-payment     - Confirm payment        ║
║   • POST /api/refund              - Create refund          ║
║   • POST /api/webhook             - Stripe webhooks        ║
║                                                            ║
║   Stripe: ${process.env.STRIPE_SECRET_KEY ? '✅ Configured' : '❌ Not configured'}                             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});

export default app;
