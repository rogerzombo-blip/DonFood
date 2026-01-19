// Restaurant and Dishes Data with Real Images and English Translation

export const restaurants = [
    // PORTUGAL RESTAURANTS
    {
        id: 1,
        name: "The Cod Tavern",
        country: "portugal",
        cuisine: "Traditional Portuguese",
        rating: 4.9,
        deliveryTime: "25-35 min",
        deliveryFee: 2.50,
        distance: "1.2 km",
        isPopular: true,
        hasPromo: true,
        emoji: "🐟",
        image: "https://images.unsplash.com/photo-1541014741259-df549fa9ba6f?auto=format&fit=crop&q=80&w=800",
        menu: [
            { id: 101, name: "Bacalhau à Brás", description: "Shredded cod with thin fries, eggs, and olives", price: 18.50, image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400", category: "Main Courses" },
            { id: 102, name: "Creamy Cod", description: "Cod flakes in a rich creamy gratin sauce", price: 17.90, image: "https://images.unsplash.com/photo-1534604973900-c41ab4c5e636?auto=format&fit=crop&q=80&w=400", category: "Main Courses" },
            { id: 104, name: "Caldo Verde", description: "Traditional potato and kale soup with chorizo", price: 6.50, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400", category: "Starters" },
            { id: 106, name: "Pastel de Nata", description: "3 units of the authentic Portuguese custard tart", price: 4.50, image: "https://images.unsplash.com/photo-1597075095304-4cbb2143896c?auto=format&fit=crop&q=80&w=400", category: "Desserts" }
        ]
    },
    {
        id: 2,
        name: "Francesinha House",
        country: "portugal",
        cuisine: "Porto Specialties",
        rating: 4.8,
        deliveryTime: "30-40 min",
        deliveryFee: 3.00,
        distance: "2.1 km",
        isPopular: true,
        hasPromo: false,
        emoji: "🥪",
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
        menu: [
            { id: 201, name: "Original Francesinha", description: "Steak, sausage, ham, and cheese sandwich with special beer sauce", price: 14.90, image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=400", category: "Francesinhas" },
            { id: 202, name: "Special Francesinha", description: "With fried egg and golden fries", price: 16.90, image: "https://images.unsplash.com/photo-1603333388123-899ca440407f?auto=format&fit=crop&q=80&w=400", category: "Francesinhas" },
            { id: 205, name: "Bifana Sandwich", description: "Traditional seasoned pork sandwich", price: 7.90, image: "https://images.unsplash.com/photo-1528739102280-40974291720f?auto=format&fit=crop&q=80&w=400", category: "Sandwiches" }
        ]
    },
    // BRAZIL RESTAURANTS
    {
        id: 4,
        name: "Brazilian Flavor",
        country: "brazil",
        cuisine: "Traditional Brazilian",
        rating: 4.9,
        deliveryTime: "25-35 min",
        deliveryFee: 2.50,
        distance: "1.5 km",
        isPopular: true,
        hasPromo: true,
        emoji: "🍖",
        image: "https://images.unsplash.com/photo-1547928576-a4a33237ecd3?auto=format&fit=crop&q=80&w=800",
        menu: [
            { id: 401, name: "Full Feijoada", description: "Black bean stew with pork, rice, kale, and farofa", price: 19.90, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400", category: "Main Courses" },
            { id: 402, name: "Grilled Picanha", description: "Premium cap of sirloin with rice, beans, and vinaigrette", price: 24.90, image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=400", category: "Main Courses" },
            { id: 405, name: "Chicken Coxinha", description: "6 units of crispy chicken croquettes with cream cheese", price: 8.90, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400", category: "Appetizers" },
            { id: 406, name: "Gourmet Brigadeiro", description: "Box with 6 units of Brazil's favorite chocolate sweet", price: 9.90, image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400", category: "Desserts" }
        ]
    },
    {
        id: 5,
        name: "Amazonian Açaí",
        country: "brazil",
        cuisine: "Açaí & Tropical Juices",
        rating: 4.8,
        deliveryTime: "15-25 min",
        deliveryFee: 2.00,
        distance: "0.8 km",
        isPopular: true,
        hasPromo: false,
        emoji: "🫐",
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=800",
        menu: [
            { id: 501, name: "Traditional Açaí 500ml", description: "Pure açaí with banana and granola", price: 14.90, image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=400", category: "Açaí Bowls" },
            { id: 502, name: "Premium Açaí 700ml", description: "With strawberry, kiwi, honey, and powdered milk", price: 19.90, image: "https://images.unsplash.com/photo-1582294101735-8575a7469733?auto=format&fit=crop&q=80&w=400", category: "Açaí Bowls" }
        ]
    },
    // ANGOLA RESTAURANTS
    {
        id: 8,
        name: "Grandma's Muamba",
        country: "angola",
        cuisine: "Authentic Angolan",
        rating: 4.9,
        deliveryTime: "30-40 min",
        deliveryFee: 3.00,
        distance: "1.8 km",
        isPopular: true,
        hasPromo: true,
        emoji: "🍲",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
        menu: [
            { id: 801, name: "Chicken Muamba", description: "Chicken slow-cooked in palm oil, okra, and chili", price: 18.90, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=400", category: "Main Courses" },
            { id: 802, name: "Fish Calulu", description: "Dried fish stew with sweet potato leaves and okra", price: 17.50, image: "https://images.unsplash.com/photo-1534948665823-76f35956718d?auto=format&fit=crop&q=80&w=400", category: "Main Courses" },
            { id: 804, name: "Kizaka", description: "Cassava leaves sautéed with peanuts", price: 8.90, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=400", category: "Sides" }
        ]
    },
    {
        id: 9,
        name: "Luanda Corner",
        country: "angola",
        cuisine: "Angolan Street Food",
        rating: 4.7,
        deliveryTime: "25-35 min",
        deliveryFee: 2.50,
        distance: "1.2 km",
        isPopular: true,
        hasPromo: false,
        emoji: "🌍",
        image: "https://images.unsplash.com/photo-1511914265872-c40672604a80?auto=format&fit=crop&q=80&w=800",
        menu: [
            { id: 901, name: "Peanut Muamba", description: "Beef with peanut sauce and spinach", price: 16.90, image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=400", category: "Main Courses" },
            { id: 904, name: "Ginginha Drink", description: "Traditional ginger beverage", price: 4.90, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400", category: "Drinks" }
        ]
    }
];

export const suggestedDishes = {
    portugal: [
        { name: "Bacalhau à Brás", description: "Portugal's most iconic dish. Shredded cod sautéed with straw potatoes, eggs, and black olives.", price: 18.50, image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400", restaurantId: 1 },
        { name: "Francesinha", description: "Porto's pride! A massive sandwich covered in melted cheese and a secret spicy beer sauce.", price: 16.90, image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=400", restaurantId: 2 }
    ],
    brazil: [
        { name: "Feijoada", description: "The national dish of Brazil! Black bean stew with tender pork cuts, served with rice and kale.", price: 19.90, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400", restaurantId: 4 },
        { name: "Grilled Picanha", description: "The noblest cut of Brazilian barbecue. Perfectly grilled, juicy, and flavorful sirloin cap.", price: 24.90, image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=400", restaurantId: 4 }
    ],
    angola: [
        { name: "Chicken Muamba", description: "Angola's national dish! Chicken slow-cooked in palm oil with okra and local spices.", price: 18.90, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=400", restaurantId: 8 },
        { name: "Fish Calulu", description: "Traditional stew of dried fish with sweet potato leaves and okra. Intense flavors of the land.", price: 17.50, image: "https://images.unsplash.com/photo-1534948665823-76f35956718d?auto=format&fit=crop&q=80&w=400", restaurantId: 8 }
    ]
};

export const getCountryFlag = (country) => {
    const flags = {
        portugal: '🇵🇹',
        brazil: '🇧🇷',
        angola: '🇦🇴'
    };
    return flags[country] || '🌍';
};

export const getCountryGradient = (country) => {
    const gradients = {
        portugal: 'linear-gradient(135deg, rgba(0, 100, 0, 0.8) 0%, rgba(196, 22, 28, 0.8) 100%)',
        brazil: 'linear-gradient(135deg, rgba(0, 151, 57, 0.8) 0%, rgba(255, 223, 0, 0.8) 100%)',
        angola: 'linear-gradient(135deg, rgba(204, 16, 33, 0.8) 0%, rgba(0, 0, 0, 0.8) 100%)'
    };
    return gradients[country] || 'linear-gradient(135deg, #FF6B35 0%, #FF8A5B 100%)';
};
