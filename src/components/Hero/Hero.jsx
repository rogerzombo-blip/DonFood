import './Hero.css';

const Hero = ({ onScrollTo }) => {
    return (
        <section className="hero" id="home">
            <div className="container">
                <div className="hero-content">
                    <div className="hero-badge">🌍 3 Countries • +50 Restaurants • +200 Dishes</div>
                    <h1 className="hero-title">
                        Authentic Flavors of<br />
                        <span className="gradient-text">Portugal • Brazil • Angola</span>
                    </h1>
                    <p className="hero-subtitle">
                        Explore the rich culinary heritage of the Portuguese-speaking world.
                        Get it delivered or <strong>Pickup & Save 15%</strong>!
                    </p>
                    <div className="hero-actions">
                        <button className="btn btn-primary" onClick={() => onScrollTo('restaurants')}>
                            <span>Browse Restaurants</span>
                            <span className="btn-arrow">→</span>
                        </button>
                        <button className="btn btn-secondary" onClick={() => onScrollTo('suggestions')}>
                            <span>Chef's Selections</span>
                        </button>
                    </div>
                    <div className="hero-stats">
                        <div className="stat glass">
                            <span className="stat-number">4.9</span>
                            <span className="stat-label">⭐ Rating</span>
                        </div>
                        <div className="stat glass">
                            <span className="stat-number">30m</span>
                            <span className="stat-label">⚡ Delivery</span>
                        </div>
                        <div className="stat glass">
                            <span className="stat-number">15%</span>
                            <span className="stat-label">💰 Savings</span>
                        </div>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="food-showcase">
                        <div className="food-card portugal glass">
                            <img src="https://images.unsplash.com/photo-1541014741259-df549fa9ba6f?auto=format&fit=crop&q=80&w=400" alt="Bacalhau" />
                            <div className="food-card-info">
                                <span className="food-flag">🇵🇹</span>
                                <span>The Cod Tavern</span>
                            </div>
                        </div>
                        <div className="food-card brazil glass">
                            <img src="https://images.unsplash.com/photo-1547928576-a4a33237ecd3?auto=format&fit=crop&q=80&w=400" alt="Feijoada" />
                            <div className="food-card-info">
                                <span className="food-flag">🇧🇷</span>
                                <span>Brazilian Flavor</span>
                            </div>
                        </div>
                        <div className="food-card angola glass">
                            <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400" alt="Muamba" />
                            <div className="food-card-info">
                                <span className="food-flag">🇦🇴</span>
                                <span>Grandma's Muamba</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
