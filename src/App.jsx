import { useState, useCallback } from 'react';
import { CartProvider } from './context/CartContext';
import { CheckoutProvider } from './context/CheckoutContext';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import CountryFilter from './components/CountryFilter/CountryFilter';
import RestaurantGrid from './components/RestaurantGrid/RestaurantGrid';
import Suggestions from './components/Suggestions/Suggestions';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import RestaurantModal from './components/RestaurantModal/RestaurantModal';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleScrollTo = useCallback((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleRestaurantClick = useCallback((restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedRestaurant(null), 300);
  }, []);

  return (
    <CartProvider>
      <CheckoutProvider>
        <div className="app">
          {/* Animated Background */}
          <div className="animated-bg">
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>
            <div className="floating-shape shape-4"></div>
          </div>

          <Header onScrollTo={handleScrollTo} />

          <main>
            <Hero onScrollTo={handleScrollTo} />

            <CountryFilter
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
            />

            <RestaurantGrid
              selectedCountry={selectedCountry}
              selectedFilter={selectedFilter}
              onSelectFilter={setSelectedFilter}
              onRestaurantClick={handleRestaurantClick}
            />

            <Suggestions onRestaurantClick={handleRestaurantClick} />
          </main>

          <Footer />

          <Cart />
          <Checkout />

          <RestaurantModal
            restaurant={selectedRestaurant}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </div>
      </CheckoutProvider>
    </CartProvider>
  );
}

export default App;
