import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { useCheckout } from '../../context/CheckoutContext';
import { useCart } from '../../context/CartContext';
import { getStripe } from '../../services/stripeService';
import StripePaymentForm from './StripePaymentForm';
import './Checkout.css';

const Checkout = () => {
    const {
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
    } = useCheckout();

    const { calculateTotals, deliveryMode } = useCart();
    const totals = calculateTotals();

    // Stripe instance
    const [stripePromise, setStripePromise] = useState(null);

    // Initialize Stripe
    useEffect(() => {
        const initStripe = async () => {
            const stripe = await getStripe();
            setStripePromise(stripe);
        };
        initStripe();
    }, []);

    const formatPrice = (price) => `$${price.toFixed(2)}`;

    // Stripe Elements appearance options (dark theme)
    const appearance = {
        theme: 'night',
        variables: {
            colorPrimary: '#6366f1',
            colorBackground: 'rgba(30, 30, 40, 0.95)',
            colorText: '#ffffff',
            colorDanger: '#ef4444',
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '12px',
            spacingUnit: '4px'
        },
        rules: {
            '.Input': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: 'none'
            },
            '.Input:focus': {
                border: '1px solid #6366f1',
                boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)'
            },
            '.Label': {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '13px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            },
            '.Tab': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            },
            '.Tab--selected': {
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: '#6366f1'
            }
        }
    };

    const elementsOptions = {
        clientSecret,
        appearance,
        loader: 'auto'
    };

    // Handle demo payment (when server is offline)
    const handleDemoPayment = async () => {
        setIsProcessing(true);
        setCheckoutStep('processing');

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        handlePaymentSuccess({
            id: `demo_${Date.now()}`,
            status: 'succeeded'
        });
    };

    if (!isCheckoutOpen) return null;

    return (
        <>
            <div className="checkout-overlay" onClick={closeCheckout} />
            <div className="checkout-modal glass">
                {/* Header */}
                <div className="checkout-header">
                    <div className="checkout-steps">
                        <div className={`step ${checkoutStep === 'details' ? 'active' : ''} ${['payment', 'processing', 'success'].includes(checkoutStep) ? 'completed' : ''}`}>
                            <span className="step-number">1</span>
                            <span className="step-label">Details</span>
                        </div>
                        <div className="step-connector" />
                        <div className={`step ${checkoutStep === 'payment' ? 'active' : ''} ${['processing', 'success'].includes(checkoutStep) ? 'completed' : ''}`}>
                            <span className="step-number">2</span>
                            <span className="step-label">Payment</span>
                        </div>
                        <div className="step-connector" />
                        <div className={`step ${checkoutStep === 'success' ? 'active completed' : ''}`}>
                            <span className="step-number">3</span>
                            <span className="step-label">Complete</span>
                        </div>
                    </div>
                    <button className="close-checkout" onClick={closeCheckout}>✕</button>
                </div>

                {/* Server Status Indicator */}
                {!isCheckingServer && (
                    <div className={`server-status ${isServerOnline ? 'online' : 'offline'}`}>
                        <span className="status-dot"></span>
                        <span>{isServerOnline ? 'Live Payment Mode' : 'Demo Mode (Server Offline)'}</span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="checkout-error glass">
                        <span className="error-icon">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Step 1: Customer Details */}
                {checkoutStep === 'details' && (
                    <div className="checkout-content">
                        <h2 className="checkout-title">
                            <span className="title-icon">📦</span>
                            Delivery Details
                        </h2>

                        <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); proceedToPayment(); }}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={customerDetails.name}
                                        onChange={(e) => updateCustomerDetails('name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        value={customerDetails.email}
                                        onChange={(e) => updateCustomerDetails('email', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    value={customerDetails.phone}
                                    onChange={(e) => updateCustomerDetails('phone', e.target.value)}
                                    required
                                />
                            </div>

                            {deliveryMode === 'delivery' && (
                                <>
                                    <div className="form-group">
                                        <label>Delivery Address *</label>
                                        <input
                                            type="text"
                                            placeholder="123 Main Street, Apt 4B"
                                            value={customerDetails.address}
                                            onChange={(e) => updateCustomerDetails('address', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>City *</label>
                                            <input
                                                type="text"
                                                placeholder="New York"
                                                value={customerDetails.city}
                                                onChange={(e) => updateCustomerDetails('city', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>ZIP Code *</label>
                                            <input
                                                type="text"
                                                placeholder="10001"
                                                value={customerDetails.zipCode}
                                                onChange={(e) => updateCustomerDetails('zipCode', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="form-group">
                                <label>Special Instructions (Optional)</label>
                                <textarea
                                    placeholder="Any special delivery instructions..."
                                    value={customerDetails.instructions}
                                    onChange={(e) => updateCustomerDetails('instructions', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            {/* Order Summary */}
                            <div className="order-summary glass">
                                <h3>Order Summary</h3>
                                <div className="summary-line">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(totals.subtotal)}</span>
                                </div>
                                {deliveryMode === 'pickup' && (
                                    <div className="summary-line discount">
                                        <span>Pickup Discount (15%)</span>
                                        <span>-{formatPrice(totals.discount)}</span>
                                    </div>
                                )}
                                <div className="summary-line">
                                    <span>Delivery Fee</span>
                                    <span>{deliveryMode === 'delivery' ? formatPrice(totals.deliveryFee) : 'FREE'}</span>
                                </div>
                                <div className="summary-line total">
                                    <span>Total</span>
                                    <span>{formatPrice(totals.total)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary checkout-submit"
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="btn-spinner"></span>
                                        Initializing Payment...
                                    </>
                                ) : (
                                    <>
                                        Continue to Payment
                                        <span className="btn-arrow">→</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: Payment with Stripe Elements */}
                {checkoutStep === 'payment' && (
                    <div className="checkout-content">
                        <h2 className="checkout-title">
                            <span className="title-icon">💳</span>
                            Secure Payment
                        </h2>

                        {/* Payment Amount */}
                        <div className="payment-amount glass">
                            <span>Amount to pay:</span>
                            <span className="amount">{formatPrice(orderDetails?.total || totals.total)}</span>
                        </div>

                        {/* Stripe Elements or Demo Form */}
                        {isServerOnline && clientSecret && stripePromise ? (
                            <Elements options={elementsOptions} stripe={stripePromise}>
                                <StripePaymentForm
                                    amount={Math.round((orderDetails?.total || totals.total) * 100)}
                                    customerEmail={customerDetails.email}
                                    onSuccess={handlePaymentSuccess}
                                    onError={handlePaymentError}
                                    onProcessing={setIsProcessing}
                                />
                            </Elements>
                        ) : (
                            <div className="demo-payment-section">
                                <div className="demo-notice glass">
                                    <span className="demo-icon">🎭</span>
                                    <div className="demo-text">
                                        <strong>Demo Mode Active</strong>
                                        <p>Payment server is not connected. Click below to simulate a successful payment.</p>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary stripe-submit-btn"
                                    onClick={handleDemoPayment}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="btn-spinner"></span>
                                            Processing Demo Payment...
                                        </>
                                    ) : (
                                        <>
                                            <span className="lock-icon">🔒</span>
                                            Complete Demo Payment • {formatPrice(orderDetails?.total || totals.total)}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Back Button */}
                        <button
                            className="btn btn-secondary back-btn"
                            onClick={goBackToDetails}
                            disabled={isProcessing}
                        >
                            ← Back to Details
                        </button>
                    </div>
                )}

                {/* Step 3: Processing */}
                {checkoutStep === 'processing' && (
                    <div className="checkout-content processing-content">
                        <div className="processing-animation">
                            <div className="processing-spinner"></div>
                            <div className="processing-card">💳</div>
                        </div>
                        <h2>Processing Payment...</h2>
                        <p>Please wait while we securely process your payment</p>
                        <div className="processing-steps">
                            <div className="processing-step active">
                                <span className="step-check">✓</span>
                                Validating payment details
                            </div>
                            <div className="processing-step active">
                                <span className="step-check">✓</span>
                                Connecting to Stripe
                            </div>
                            <div className="processing-step">
                                <span className="step-loader"></span>
                                Processing transaction
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Success */}
                {checkoutStep === 'success' && (
                    <div className="checkout-content success-content">
                        <div className="success-animation">
                            <div className="success-circle">
                                <span className="success-check">✓</span>
                            </div>
                            <div className="confetti">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className={`confetti-piece confetti-${i % 5}`} />
                                ))}
                            </div>
                        </div>
                        <h2>Payment Successful! 🎉</h2>
                        <p>Thank you for your order</p>

                        <div className="order-confirmation glass">
                            <div className="confirmation-row">
                                <span>Order ID</span>
                                <span className="order-id">{orderDetails?.orderId}</span>
                            </div>
                            <div className="confirmation-row">
                                <span>Amount Paid</span>
                                <span>{formatPrice(paymentResult?.amount || orderDetails?.total)}</span>
                            </div>
                            <div className="confirmation-row">
                                <span>Payment ID</span>
                                <span className="payment-id">{paymentResult?.paymentIntentId?.slice(0, 20)}...</span>
                            </div>
                            <div className="confirmation-row">
                                <span>Delivery Mode</span>
                                <span>{deliveryMode === 'delivery' ? '🛵 Delivery' : '🏃 Pickup'}</span>
                            </div>
                        </div>

                        <div className="success-message glass">
                            {deliveryMode === 'delivery' ? (
                                <p>Your delicious meal will arrive in <strong>30-45 minutes</strong>. You will receive an email confirmation at <strong>{orderDetails?.customer?.email}</strong></p>
                            ) : (
                                <p>Your order will be ready for pickup in <strong>15-20 minutes</strong>. Show this confirmation at the restaurant.</p>
                            )}
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={resetCheckout}
                        >
                            Back to Home
                        </button>
                    </div>
                )}

                {/* Error State */}
                {checkoutStep === 'error' && (
                    <div className="checkout-content error-content">
                        <div className="error-animation">
                            <div className="error-circle">
                                <span className="error-x">✕</span>
                            </div>
                        </div>
                        <h2>Payment Failed</h2>
                        <p>{error || 'An error occurred while processing your payment'}</p>

                        <div className="error-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={resetCheckout}
                            >
                                Cancel Order
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={goBackToDetails}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Checkout;
