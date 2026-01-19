import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [deliveryMode, setDeliveryMode] = useState('delivery');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    }, []);

    const addToCart = useCallback((item, restaurant) => {
        setCart(prevCart => {
            // Use a consistent ID based on the item's original ID or name
            const itemId = item.originalId || item.id;
            const existingItem = prevCart.find(cartItem => (cartItem.originalId || cartItem.id) === itemId);

            if (existingItem) {
                return prevCart.map(cartItem =>
                    (cartItem.originalId || cartItem.id) === itemId
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }

            return [...prevCart, {
                ...item,
                originalId: itemId,
                quantity: 1,
                restaurantName: restaurant.name,
                restaurantId: restaurant.id
            }];
        });

        showNotification(`Added ${item.name} to cart! 😋`);
        setIsCartOpen(true); // Open cart to show progress
    }, [showNotification]);

    const updateQuantity = useCallback((itemId, change) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === itemId) {
                    const newQuantity = item.quantity + change;
                    if (newQuantity <= 0) return null;
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(Boolean);
        });
    }, []);

    const removeFromCart = useCallback((itemId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);
    const openCart = useCallback(() => setIsCartOpen(true), []);

    const calculateTotals = useCallback(() => {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discount = deliveryMode === 'pickup' ? subtotal * 0.15 : 0;
        const deliveryFee = deliveryMode === 'delivery' ? 2.50 : 0;
        const total = subtotal - discount + deliveryFee;

        return { subtotal, discount, deliveryFee, total };
    }, [cart, deliveryMode]);

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const value = {
        cart,
        deliveryMode,
        setDeliveryMode,
        isCartOpen,
        notification,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        closeCart,
        openCart,
        calculateTotals,
        totalItems
    };

    return (
        <CartContext.Provider value={value}>
            {children}
            {notification && (
                <div className="global-notification glass">
                    <span className="notif-icon">✨</span>
                    {notification}
                </div>
            )}
        </CartContext.Provider>
    );
};
