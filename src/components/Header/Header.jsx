import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = ({ onScrollTo }) => {
    const { deliveryMode, setDeliveryMode, toggleCart, totalItems } = useCart();

    return (
        <header className="header glass">
            <div className="container">
                <div className="logo" onClick={() => onScrollTo('home')}>
                    <span className="logo-icon">🍽️</span>
                    <span className="logo-text">
                        Lusofonia<span className="highlight">Eats</span>
                    </span>
                </div>

                <nav className="nav">
                    <a href="#home" className="nav-link" onClick={(e) => { e.preventDefault(); onScrollTo('home'); }}>Home</a>
                    <a href="#countries" className="nav-link" onClick={(e) => { e.preventDefault(); onScrollTo('countries'); }}>Cuisines</a>
                    <a href="#restaurants" className="nav-link" onClick={(e) => { e.preventDefault(); onScrollTo('restaurants'); }}>Restaurants</a>
                    <a href="#suggestions" className="nav-link" onClick={(e) => { e.preventDefault(); onScrollTo('suggestions'); }}>Chef's Picks</a>
                </nav>

                <div className="header-actions">
                    <div className="delivery-toggle glass">
                        <button
                            className={`toggle-btn ${deliveryMode === 'delivery' ? 'active' : ''}`}
                            onClick={() => setDeliveryMode('delivery')}
                        >
                            <span className="toggle-icon">🛵</span> Delivery
                        </button>
                        <button
                            className={`toggle-btn ${deliveryMode === 'pickup' ? 'active' : ''}`}
                            onClick={() => setDeliveryMode('pickup')}
                        >
                            <span className="toggle-icon">🏃</span> Pickup
                            <span className="discount-badge">-15% OFF</span>
                        </button>
                    </div>

                    <button className="cart-btn glass" onClick={toggleCart}>
                        <span className="cart-icon">🛒</span>
                        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
