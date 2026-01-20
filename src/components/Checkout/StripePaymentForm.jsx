/**
 * Stripe Elements Payment Form
 * Uses official Stripe Elements for secure, PCI-compliant card input
 */

import { useState, useEffect } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import './StripePaymentForm.css';

const StripePaymentForm = ({
    onSuccess,
    onError,
    onProcessing,
    amount,
    customerEmail
}) => {
    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (!stripe) return;

        // Check for redirect result
        const clientSecret = new URLSearchParams(window.location.search).get(
            'payment_intent_client_secret'
        );

        if (clientSecret) {
            stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
                switch (paymentIntent.status) {
                    case 'succeeded':
                        onSuccess?.(paymentIntent);
                        break;
                    case 'processing':
                        setMessage('Your payment is processing.');
                        break;
                    case 'requires_payment_method':
                        setMessage('Your payment was not successful, please try again.');
                        break;
                    default:
                        setMessage('Something went wrong.');
                        break;
                }
            });
        }
    }, [stripe, onSuccess]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setMessage(null);
        onProcessing?.(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.origin + '/payment-success',
                    receipt_email: customerEmail
                },
                redirect: 'if_required'
            });

            if (error) {
                if (error.type === 'card_error' || error.type === 'validation_error') {
                    setMessage(error.message);
                } else {
                    setMessage('An unexpected error occurred.');
                }
                onError?.(error);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                onSuccess?.(paymentIntent);
            }
        } catch (err) {
            setMessage('An unexpected error occurred.');
            onError?.(err);
        } finally {
            setIsProcessing(false);
            onProcessing?.(false);
        }
    };

    const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

    return (
        <form onSubmit={handleSubmit} className="stripe-payment-form">
            <div className="payment-element-wrapper">
                <PaymentElement
                    id="payment-element"
                    options={{
                        layout: 'tabs',
                        defaultValues: {
                            billingDetails: {
                                email: customerEmail
                            }
                        }
                    }}
                />
            </div>

            {message && (
                <div className="payment-message glass">
                    <span className="message-icon">⚠️</span>
                    {message}
                </div>
            )}

            <button
                type="submit"
                disabled={isProcessing || !stripe || !elements}
                className="btn btn-primary stripe-submit-btn"
            >
                {isProcessing ? (
                    <>
                        <span className="btn-spinner"></span>
                        Processing...
                    </>
                ) : (
                    <>
                        <span className="lock-icon">🔒</span>
                        Pay {formatPrice(amount)}
                    </>
                )}
            </button>

            <div className="stripe-security-badge">
                <span className="powered-by">Powered by</span>
                <svg className="stripe-logo" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#635BFF" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a10.8 10.8 0 0 1-4.56 1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.02 1.04-.06 1.58zm-5.92-5.62c-1.19 0-2.04.9-2.21 2.53h4.29c-.04-1.58-.75-2.53-2.08-2.53zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 9.17c-.84 0-1.62.43-2.01 1.09l.02 5.58c.4.64 1.13 1.02 2 1.02 1.54 0 2.6-1.68 2.6-3.86 0-2.14-1.06-3.83-2.61-3.83zM28.24 5.57h4.13v14.44h-4.13zm0-5.53 4.13-.88v3.95l-4.13.88V.04zm-6.07 15.5-.02-.02c-.4.67-1.27 1.12-2.48 1.12-2 0-3.75-1.79-3.75-4.23 0-2.4 1.71-4.29 3.7-4.29 1.19 0 2.06.47 2.47 1.12l.02-1.02h4.12v9.24c0 3.9-2.94 5.5-6.3 5.5a11.06 11.06 0 0 1-4.75-1.07l1.26-3.03c.95.5 2.08.87 3.3.87 1.48 0 2.43-.73 2.43-2.1v-2.09zm-2.58-3.15c0 .95.68 1.6 1.5 1.6.85 0 1.5-.65 1.5-1.6 0-.92-.65-1.57-1.5-1.57-.82 0-1.5.65-1.5 1.57zM6.24 20.3a6.56 6.56 0 0 1-4.94-2.07l1.74-2.76c1 .87 2 1.34 3.03 1.34.75 0 1.12-.27 1.12-.65 0-.53-.68-.7-1.54-.95-1.6-.44-3.77-1.1-3.77-3.76 0-2.16 1.78-4.28 4.98-4.28 1.61 0 3.27.57 4.38 1.67l-1.7 2.67a5.23 5.23 0 0 0-2.54-.97c-.65 0-1.03.26-1.03.6 0 .44.53.64 1.28.85 1.5.43 3.97 1.06 3.97 3.86 0 2.27-1.67 4.45-5 4.45z" />
                </svg>
            </div>
        </form>
    );
};

export default StripePaymentForm;
