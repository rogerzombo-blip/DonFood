import { suggestedDishes, restaurants } from '../../data/restaurants';
import { useCart } from '../../context/CartContext';
import './Suggestions.css';

const countryInfo = {
    portugal: { flag: '🇵🇹', name: 'Portugal', tagline: 'Land of Cod & Pastries' },
    brazil: { flag: '🇧🇷', name: 'Brazil', tagline: 'Intense Tropical Soul' },
    angola: { flag: '🇦🇴', name: 'Angola', tagline: 'Heart of Africa' }
};

const DishCard = ({ dish, onAddToCart, onViewRestaurant }) => {
    return (
        <div className="dish-card glass" onClick={() => onViewRestaurant(dish.restaurantId)}>
            <div className="dish-image-wrapper">
                <img src={dish.image} alt={dish.name} className="dish-img" />
                <div className="dish-price-tag">$ {dish.price.toFixed(2)}</div>
            </div>
            <div className="dish-content">
                <h4 className="dish-name">{dish.name}</h4>
                <p className="dish-description">{dish.description}</p>
                <div className="dish-footer">
                    <button
                        className="btn btn-primary add-to-cart-btn"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent opening restaurant modal
                            onAddToCart(dish);
                        }}
                    >
                        Add to Order +
                    </button>
                </div>
            </div>
        </div>
    );
};

const Suggestions = ({ onRestaurantClick }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (dish) => {
        // Find the restaurant to get proper metadata
        const restaurant = restaurants.find(r => r.id === dish.restaurantId);

        // Find the actual item in the restaurant menu to get its real ID
        const menuItem = restaurant.menu.find(m => m.name === dish.name);

        const item = {
            id: menuItem ? menuItem.id : `${dish.name}-${dish.restaurantId}`, // Fallback ID
            originalId: menuItem ? menuItem.id : null,
            name: dish.name,
            price: dish.price,
            description: dish.description,
            image: dish.image,
            emoji: dish.emoji || '🍽️'
        };

        addToCart(item, restaurant);
    };

    const handleViewRestaurant = (restaurantId) => {
        const restaurant = restaurants.find(r => r.id === restaurantId);
        if (restaurant) onRestaurantClick(restaurant);
    };

    return (
        <section className="suggestions-section" id="suggestions">
            <div className="container">
                <div className="suggestions-header">
                    <span className="section-badge">Masterpiece Selections</span>
                    <h2 className="section-title">Must-Try Specialties</h2>
                    <p className="section-subtitle">Discover curated flavors from our heritage kitchens</p>
                </div>

                {Object.entries(suggestedDishes).map(([country, dishes]) => (
                    <div key={country} className="suggestion-country">
                        <div className={`country-header ${country}-header glass`}>
                            <span className="flag">{countryInfo[country].flag}</span>
                            <div className="country-info-text">
                                <h3>{countryInfo[country].name}</h3>
                                <span className="tagline">{countryInfo[country].tagline}</span>
                            </div>
                        </div>
                        <div className="dishes-carousel">
                            {dishes.map((dish, index) => (
                                <DishCard
                                    key={index}
                                    dish={dish}
                                    onAddToCart={handleAddToCart}
                                    onViewRestaurant={handleViewRestaurant}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Suggestions;
