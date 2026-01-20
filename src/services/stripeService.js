/**
 * Stripe Service - Real Implementation
 * 
 * This service handles all Stripe-related operations using the real Stripe API.
 * Uses @stripe/stripe-js for secure payment processing.
 */

import { loadStripe } from '@stripe/stripe-js';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Stripe Promise - initialized once and reused
let stripePromise = null;

/**
 * Initialize Stripe.js with the publishable key from the server
 */
export const getStripe = async () => {
    if (!stripePromise) {
        try {
            // Fetch publishable key from server
            const response = await fetch(`${API_BASE_URL}/config`);
            const { publishableKey } = await response.json();

            if (publishableKey) {
                stripePromise = loadStripe(publishableKey);
            } else {
                // Fallback to environment variable
                const envKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
                if (envKey) {
                    stripePromise = loadStripe(envKey);
                } else {
                    console.warn('⚠️ Stripe publishable key not found. Using demo mode.');
                    stripePromise = null;
                }
            }
        } catch (error) {
            console.error('Error fetching Stripe config:', error);
            // Try environment variable as fallback
            const envKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
            if (envKey) {
                stripePromise = loadStripe(envKey);
            }
        }
    }
    return stripePromise;
};

/**
 * Create a Payment Intent via backend
 * @param {number} amount - Amount in cents
 * @param {string} currency - Currency code (e.g., 'usd', 'eur', 'brl')
 * @param {object} metadata - Additional metadata for the payment
 */
export const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}/create-payment-intent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency, metadata })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create payment intent');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
    }
};

/**
 * Confirm payment status with backend
 * @param {string} paymentIntentId - The Payment Intent ID
 */
export const confirmPaymentStatus = async (paymentIntentId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/confirm-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntentId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to confirm payment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error confirming payment:', error);
        throw error;
    }
};

/**
 * Get payment intent details
 * @param {string} paymentIntentId - The Payment Intent ID
 */
export const getPaymentIntent = async (paymentIntentId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/payment-intent/${paymentIntentId}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get payment intent');
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting payment intent:', error);
        throw error;
    }
};

/**
 * Request a refund
 * @param {string} paymentIntentId - The Payment Intent ID
 * @param {number} amount - Optional amount to refund (in cents), full refund if not specified
 * @param {string} reason - Reason for refund
 */
export const requestRefund = async (paymentIntentId, amount = null, reason = 'requested_by_customer') => {
    try {
        const response = await fetch(`${API_BASE_URL}/refund`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntentId, amount, reason })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create refund');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating refund:', error);
        throw error;
    }
};

/**
 * Check if backend server is available
 */
export const checkServerHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        return data.status === 'ok';
    } catch (error) {
        console.error('Server health check failed:', error);
        return false;
    }
};

// ============ Card Validation Utilities ============

/**
 * Validate card details (for pre-validation before Stripe Elements)
 * @param {object} cardDetails - Card information to validate
 */
export const validateCardDetails = (cardDetails) => {
    const { cardNumber, expiryDate, cvv, cardholderName } = cardDetails;

    // Remove spaces from card number
    const cleanCardNumber = cardNumber?.replace(/\s/g, '') || '';

    // Validate card number (Luhn algorithm)
    if (!cleanCardNumber || cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
        return { isValid: false, error: 'Invalid card number' };
    }

    if (!isValidLuhn(cleanCardNumber)) {
        return { isValid: false, error: 'Invalid card number' };
    }

    // Validate expiry date
    if (!expiryDate || !isValidExpiryDate(expiryDate)) {
        return { isValid: false, error: 'Invalid expiry date' };
    }

    // Validate CVV
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
        return { isValid: false, error: 'Invalid CVV' };
    }

    // Validate cardholder name
    if (!cardholderName || cardholderName.trim().length < 2) {
        return { isValid: false, error: 'Invalid cardholder name' };
    }

    return { isValid: true };
};

/**
 * Get card brand from card number
 * @param {string} cardNumber - The card number
 */
export const getCardBrand = (cardNumber) => {
    const cleanNumber = cardNumber?.replace(/\s/g, '') || '';

    const patterns = {
        visa: /^4/,
        mastercard: /^5[1-5]|^2[2-7]/,
        amex: /^3[47]/,
        discover: /^6(?:011|5)/,
        diners: /^3(?:0[0-5]|[68])/,
        jcb: /^(?:2131|1800|35)/
    };

    for (const [brand, pattern] of Object.entries(patterns)) {
        if (pattern.test(cleanNumber)) {
            return brand;
        }
    }

    return 'unknown';
};

/**
 * Format card number with spaces
 * @param {string} cardNumber - The card number to format
 */
export const formatCardNumber = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    const brand = getCardBrand(cleanNumber);

    // AMEX has different formatting (4-6-5)
    if (brand === 'amex') {
        return cleanNumber.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').trim();
    }

    // Standard formatting (4-4-4-4)
    return cleanNumber.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

/**
 * Format expiry date (MM/YY)
 * @param {string} value - The expiry date value
 */
export const formatExpiryDate = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 2) {
        return cleanValue.slice(0, 2) + (cleanValue.length > 2 ? '/' + cleanValue.slice(2, 4) : '');
    }
    return cleanValue;
};

// ============ Helper Functions ============

/**
 * Luhn algorithm for card number validation
 */
const isValidLuhn = (cardNumber) => {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

/**
 * Validate expiry date
 */
const isValidExpiryDate = (expiryDate) => {
    const [month, year] = expiryDate.split('/');
    const expMonth = parseInt(month, 10);
    const expYear = parseInt('20' + year, 10);

    if (expMonth < 1 || expMonth > 12) return false;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;

    return true;
};

export default {
    getStripe,
    createPaymentIntent,
    confirmPaymentStatus,
    getPaymentIntent,
    requestRefund,
    checkServerHealth,
    validateCardDetails,
    getCardBrand,
    formatCardNumber,
    formatExpiryDate
};
