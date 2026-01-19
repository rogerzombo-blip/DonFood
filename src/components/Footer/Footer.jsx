import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="logo">
                            <span className="logo-icon">🍽️</span>
                            <span className="logo-text">
                                Lusofonia<span className="highlight">Eats</span>
                            </span>
                        </div>
                        <p>Bringing authentic flavors from the Portuguese-speaking world straight to your doorstep.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Explore</h4>
                        <a href="#home">Home</a>
                        <a href="#restaurants">Restaurants</a>
                        <a href="#suggestions">Chef's Picks</a>
                    </div>
                    <div className="footer-contact">
                        <h4>Contact Us</h4>
                        <p>📧 support@lusofoniaeats.com</p>
                        <p>📱 +351 912 345 678</p>
                        <p>📍 Worldwide HQ - Lisbon, Portugal</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 Lusofonia Eats. All rights reserved.</p>
                    <p>Made with ❤️ for food lovers worldwide</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
