import './CountryFilter.css';

const countries = [
    { id: 'all', icon: '🌍', name: 'Global', subtitle: 'View All' },
    { id: 'portugal', icon: '🇵🇹', name: 'Portugal', subtitle: 'Atlantic Flavors', dishes: 'Cod, Pastries, Francesinha' },
    { id: 'brazil', icon: '🇧🇷', name: 'Brazil', subtitle: 'Tropical Heart', dishes: 'Feijoada, Açaí, Moqueca' },
    { id: 'angola', icon: '🇦🇴', name: 'Angola', subtitle: 'African Roots', dishes: 'Muamba, Calulu, Kizaka' }
];

const CountryFilter = ({ selectedCountry, onSelectCountry }) => {
    return (
        <section className="countries-section" id="countries">
            <div className="container">
                <span className="section-badge">Discover Cuisines</span>
                <h2 className="section-title">Select Your Journey</h2>
                <div className="country-cards">
                    {countries.map(country => (
                        <div
                            key={country.id}
                            className={`country-card glass ${selectedCountry === country.id ? 'active' : ''}`}
                            onClick={() => onSelectCountry(country.id)}
                        >
                            <div className="country-icon">{country.icon}</div>
                            <h3>{country.name}</h3>
                            <p>{country.subtitle}</p>
                            {country.dishes && (
                                <div className="country-dishes">{country.dishes}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CountryFilter;
