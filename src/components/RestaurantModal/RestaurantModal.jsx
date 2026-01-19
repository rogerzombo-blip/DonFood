import { useState } from 'react';
import { getCountryFlag } from '../../data/restaurants';
import { useCart } from '../../context/CartContext';
import './RestaurantModal.css';

const RestaurantModal = ({ restaurant, isOpen, onClose }) => {
    const { addToCart } = useCart();
    const [selectedCategory, setSelectedCategory] = useState(null);

    if (!restaurant || !isOpen) return null;

    const categories = [...new Set(restaurant.menu.map(item => item.category))];
    const currentCategory = selectedCategory || categories[0];
    const filteredItems = restaurant.menu.filter(item => item.category === currentCategory);

    const formatPrice = (price) => `$${price.toFixed(2)}`;

    const handleAddToCart = (item) => {
        // Add essential metadata for the cart
        const cartItem = {
            ...item,
            originalId: item.id,
            image: item.image || restaurant.image // Fallback to restaurant image if dish image missing
        };
        addToCart(cartItem, { id: restaurant.id, name: restaurant.name });
    };

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="modal-content glass" onClick={e => e.stopPropagation()}>
                <button className="modal-close glass" onClick={onClose}>✕</button>

                <div className="modal-header">
                    <img src={restaurant.image} alt="" className="modal-bg-img" />
                    <div className="modal-header-content">
                        <h2 className="modal-restaurant-name">{restaurant.name}</h2>
                        <div className="modal-restaurant-info">
                            <span className="info-item">{getCountryFlag(restaurant.country)} {restaurant.cuisine}</span>
                            <span className="info-item">⭐ {restaurant.rating}</span>
                            <span className="info-item">🕒 {restaurant.deliveryTime}</span>
                        </div>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="menu-categories-wrapper">
                        <div className="menu-categories">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`menu-category ${currentCategory === category ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="menu-items">
                        {filteredItems.map(item => (
                            <div key={item.id} className="menu-item glass">
                                <img src={item.image} alt={item.name} className="menu-item-img" />
                                <div className="menu-item-content">
                                    <div className="menu-item-header">
                                        <h4 className="menu-item-name">{item.name}</h4>
                                        <span className="menu-item-price">{formatPrice(item.price)}</span>
                                    </div>
                                    <p className="menu-item-description">{item.description}</p>
                                    <button
                                        className="btn btn-primary add-menu-btn"
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        Add to Cart +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantModal;
