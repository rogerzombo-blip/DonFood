import { getCountryFlag } from '../../data/restaurants';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant, onClick }) => {
    const formatPrice = (price) => `$${price.toFixed(2)}`;

    return (
        <div className="restaurant-card glass" onClick={onClick}>
            <div className="restaurant-image-wrapper">
                <img src={restaurant.image} alt={restaurant.name} className="restaurant-img" />
                <div className="restaurant-overlay">
                    <div className="restaurant-badge">
                        <span className="badge badge-country">{getCountryFlag(restaurant.country)}</span>
                        {restaurant.hasPromo && <span className="badge badge-promo">PROMO</span>}
                    </div>
                    <span className="restaurant-rating">⭐ {restaurant.rating}</span>
                </div>
            </div>
            <div className="restaurant-info">
                <h3 className="restaurant-name">{restaurant.name}</h3>
                <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                <div className="restaurant-meta">
                    <span>🕒 {restaurant.deliveryTime}</span>
                    <span>📍 {restaurant.distance}</span>
                    <span className="fee">🛵 {formatPrice(restaurant.deliveryFee)}</span>
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;
