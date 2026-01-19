import { useMemo } from 'react';
import RestaurantCard from '../RestaurantCard/RestaurantCard';
import { restaurants } from '../../data/restaurants';
import './RestaurantGrid.css';

const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'popular', label: 'Popular' },
    { id: 'nearby', label: 'Nearby' },
    { id: 'promo', label: 'Offers' }
];

const RestaurantGrid = ({
    selectedCountry,
    selectedFilter,
    onSelectFilter,
    onRestaurantClick
}) => {
    const filteredRestaurants = useMemo(() => {
        let result = [...restaurants];

        if (selectedCountry !== 'all') {
            result = result.filter(r => r.country === selectedCountry);
        }

        if (selectedFilter === 'popular') {
            result = result.filter(r => r.isPopular);
        } else if (selectedFilter === 'promo') {
            result = result.filter(r => r.hasPromo);
        } else if (selectedFilter === 'nearby') {
            result = result.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        }

        return result;
    }, [selectedCountry, selectedFilter]);

    return (
        <section className="restaurants-section" id="restaurants">
            <div className="container">
                <div className="section-header">
                    <div>
                        <span className="section-badge">Local Favorites</span>
                        <h2 className="section-title" style={{ textAlign: 'left' }}>Popular Restaurants</h2>
                    </div>
                    <div className="filter-tabs glass">
                        {filterTabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`filter-tab ${selectedFilter === tab.id ? 'active' : ''}`}
                                onClick={() => onSelectFilter(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="restaurants-grid">
                    {filteredRestaurants.map(restaurant => (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            onClick={() => onRestaurantClick(restaurant)}
                        />
                    ))}
                </div>
                {filteredRestaurants.length === 0 && (
                    <div className="no-results">
                        <span className="no-results-icon">🔍</span>
                        <p>No restaurants found for this selection.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default RestaurantGrid;
