import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPaymentIntent, checkServerHealth } from '../services/stripeService';
import { useCart } from './CartContext';

const CheckoutContext = createContext();

export const useCheckout = () => {
    const context = useContext(CheckoutContext);
    if (!context) {
        throw new Error('useCheckout must be used within a CheckoutProvider');
    }
    return context;
};

export const CheckoutProvider = ({ children }) => {
    const { cart, calculateTotals, clearCart, deliveryMode, closeCart } = useCart();

    // Server status
    const [isServerOnline, setIsServerOnline] = useState(false);
    const [isCheckingServer, setIsCheckingServer] = useState(true);

    // Checkout state
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState('details'); // 'details' | 'payment' | 'processing' | 'success' | 'error'
    const [orderDetails, setOrderDetails] = useState(null);
    const [paymentResult, setPaymentResult] = useState(null);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Stripe state
    const [clientSecret, setClientSecret] = useState(null);
    const [paymentIntentId, setPaymentIntentId] = useState(null);

    // Customer details
    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        instructions: ''
    });

    // Check server status on mount
    useEffect(() => {
        const checkServer = async () => {
            setIsCheckingServer(true);
            const isOnline = await checkServerHealth();
            setIsServerOnline(isOnline);
            setIsCheckingServer(false);
        };
        checkServer();
    }, []);

    // Open checkout modal
    const openCheckout = useCallback(() => {
        if (cart.length === 0) {
            setError('Your cart is empty');
            return;
        }
        setIsCheckoutOpen(true);
        setCheckoutStep('details');
        setError(null);
        setClientSecret(null);
        setPaymentIntentId(null);
    }, [cart.length]);

    // Close checkout modal
    const closeCheckout = useCallback(() => {
        if (!isProcessing) {
            setIsCheckoutOpen(false);
            setCheckoutStep('details');
            setError(null);
            setClientSecret(null);
            setPaymentIntentId(null);
        }
    }, [isProcessing]);

    // Update customer details
    const updateCustomerDetails = useCallback((field, value) => {
        setCustomerDetails(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    // Validate customer details
    const validateCustomerDetails = useCallback(() => {
        const { name, email, phone } = customerDetails;

        if (!name || name.trim().length < 2) {
            return { isValid: false, error: 'Please enter your name' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return { isValid: false, error: 'Please enter a valid email' };
        }

        if (!phone || phone.length < 10) {
            return { isValid: false, error: 'Please enter a valid phone number' };
        }

        if (deliveryMode === 'delivery') {
            const { address, city, zipCode } = customerDetails;
            if (!address || address.trim().length < 5) {
                return { isValid: false, error: 'Please enter your delivery address' };
            }
            if (!city || city.trim().length < 2) {
                return { isValid: false, error: 'Please enter your city' };
            }
            if (!zipCode || zipCode.trim().length < 5) {
                return { isValid: false, error: 'Please enter your ZIP code' };
            }
        }

        return { isValid: true };
    }, [customerDetails, deliveryMode]);

    // Proceed to payment step - creates Payment Intent
    const proceedToPayment = useCallback(async () => {
        const validation = validateCustomerDetails();
        if (!validation.isValid) {
            setError(validation.error);
            return false;
        }

        const totals = calculateTotals();
        const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

        const newOrderDetails = {
            orderId,
            items: cart,
            ...totals,
            deliveryMode,
            customer: customerDetails,
            createdAt: new Date().toISOString()
        };

        setOrderDetails(newOrderDetails);
        setError(null);

        // If server is online, create real Payment Intent
        if (isServerOnline) {
            setIsProcessing(true);
            try {
                const amountInCents = Math.round(totals.total * 100);
                const response = await createPaymentIntent(amountInCents, 'usd', {
                    orderId,
                    customerEmail: customerDetails.email,
                    customerName: customerDetails.name,
                    deliveryMode,
                    itemCount: cart.length
                });

                setClientSecret(response.clientSecret);
                setPaymentIntentId(response.paymentIntentId);
                setCheckoutStep('payment');
                setIsProcessing(false);
                return true;
            } catch (err) {
                setError(err.message || 'Failed to initialize payment');
                setIsProcessing(false);
                return false;
            }
        } else {
            // Demo mode - proceed without real Payment Intent
            setCheckoutStep('payment');
            return true;
        }
    }, [validateCustomerDetails, calculateTotals, cart, deliveryMode, customerDetails, isServerOnline]);

    // Handle successful payment
    const handlePaymentSuccess = useCallback((paymentIntent) => {
        setPaymentResult({
            success: true,
            paymentIntentId: paymentIntent?.id || paymentIntentId,
            amount: orderDetails?.total,
            currency: 'usd',
            timestamp: new Date().toISOString()
        });
        setCheckoutStep('success');
        clearCart();
        closeCart();
    }, [paymentIntentId, orderDetails, clearCart, closeCart]);

    // Handle payment error
    const handlePaymentError = useCallback((err) => {
        setError(err.message || 'Payment failed');
        setCheckoutStep('error');
    }, []);

    // Reset checkout
    const resetCheckout = useCallback(() => {
        setIsCheckoutOpen(false);
        setCheckoutStep('details');
        setOrderDetails(null);
        setPaymentResult(null);
        setError(null);
        setIsProcessing(false);
        setClientSecret(null);
        setPaymentIntentId(null);
        setCustomerDetails({
            name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            zipCode: '',
            instructions: ''
        });
    }, []);

    // Go back to details step
    const goBackToDetails = useCallback(() => {
        setCheckoutStep('details');
        setError(null);
    }, []);

    const value = {
        // State
        isCheckoutOpen,
        checkoutStep,
        orderDetails,
        paymentResult,
        error,
        isProcessing,
        customerDetails,
        isServerOnline,
        isCheckingServer,
        clientSecret,
        paymentIntentId,

        // Actions
        openCheckout,
        closeCheckout,
        updateCustomerDetails,
        proceedToPayment,
        handlePaymentSuccess,
        handlePaymentError,
        resetCheckout,
        goBackToDetails,
        setError,
        setIsProcessing,
        setCheckoutStep
    };

    return (
        <CheckoutContext.Provider value={value}>
            {children}
        </CheckoutContext.Provider>
    );
};

export default CheckoutContext;
