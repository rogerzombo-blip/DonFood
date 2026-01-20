import { useCart } from '../../context/CartContext';
import { useCheckout } from '../../context/CheckoutContext';
import './Cart.css';

const Cart = () => {
    const {
        cart,
        deliveryMode,
        isCartOpen,
        closeCart,
        updateQuantity,
        calculateTotals,
    } = useCart();

    const { openCheckout } = useCheckout();

    const formatPrice = (price) => `$${price.toFixed(2)}`;
    const totals = calculateTotals();

    const handleCheckout = () => {
        if (cart.length === 0) return;
        openCheckout();
    };

    return (
        <>
            <div
                className={`cart-overlay ${isCartOpen ? 'active' : ''}`}
                onClick={closeCart}
            />
            <aside className={`cart-sidebar glass ${isCartOpen ? 'active' : ''}`}>
                <div className="cart-header">
                    <div className="cart-title">
                        <h3>🛒 Your Order</h3>
                        <span className="cart-badge glass">{cart.length} items</span>
                    </div>
                    <button className="close-cart glass" onClick={closeCart}>✕</button>
                </div>

                <div className={`delivery-mode-info ${deliveryMode === 'pickup' ? 'pickup' : ''} glass`}>
                    <div className="mode-graphic">
                        <span className="mode-icon">{deliveryMode === 'delivery' ? '🛵' : '🏃'}</span>
                    </div>
                    <div className="mode-details">
                        <span className="mode-text">
                            {deliveryMode === 'delivery' ? 'Standard Delivery' : 'Self-Pickup Reward'}
                        </span>
                        <span className="mode-subtext">
                            {deliveryMode === 'delivery' ? 'Estimated 45 min' : 'Save 15% on this order'}
                        </span>
                    </div>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <div className="empty-icon-wrapper">
                                <span className="empty-icon">🍱</span>
                            </div>
                            <h4>Your cart is empty</h4>
                            <p>Time to discover some amazing Lusophone flavors!</p>
                            <button className="btn btn-secondary" style={{ marginTop: '20px' }} onClick={closeCart}>
                                Browse Menu
                            </button>
                        </div>
                    ) : (
                        cart.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="cart-item glass">
                                <img src={item.image} alt={item.name} className="cart-item-img" />
                                <div className="cart-item-info">
                                    <div className="cart-item-main">
                                        <div className="cart-item-name">{item.name}</div>
                                        <div className="cart-item-restaurant">{item.restaurantName}</div>
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="quantity-control glass">
                                            <button className="quantity-btn" onClick={() => updateQuantity(item.id, -1)}>−</button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button className="quantity-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                        </div>
                                        <span className="cart-item-price">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-summary">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>{formatPrice(totals.subtotal)}</span>
                            </div>
                            {deliveryMode === 'pickup' && (
                                <div className="summary-row discount-row">
                                    <span>Pickup Discount (15%)</span>
                                    <span>−{formatPrice(totals.discount)}</span>
                                </div>
                            )}
                            <div className="summary-row">
                                <span>Delivery Fee</span>
                                <span>{deliveryMode === 'delivery' ? formatPrice(totals.deliveryFee) : 'FREE'}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total Amount</span>
                                <span>{formatPrice(totals.total)}</span>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary checkout-btn"
                            onClick={handleCheckout}
                        >
                            💳 Pay with Card • {formatPrice(totals.total)}
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Cart;
