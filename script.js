// Product data
const products = [
    // TVs Category
    {
        id: 1,
        name: "4K Smart TV",
        price: 87999,
        image: "images/tv.jpg",
        description: "65-inch 4K Ultra HD Smart LED TV",
        category: "TVs"
    },
    {
        id: 2,
        name: "Gaming Monitor",
        price: 54999,
        image: "images/monitor.jpg",
        description: "32-inch 4K Gaming Monitor",
        category: "TVs"
    },
    // Laptops Category
    {
        id: 3,
        name: "Gaming Laptop",
        price: 164999,
        image: "images/gaming-laptop.jpg",
        description: "RTX 3080, 16GB RAM",
        category: "Laptops"
    },
    {
        id: 4,
        name: "Ultrabook",
        price: 142999,
        image: "images/ultrabook.jpg",
        description: "Thin & Light, 1TB SSD",
        category: "Laptops"
    },
    // Phones & Tablets Category
    {
        id: 5,
        name: "Premium Smartphone",
        price: 109999,
        image: "images/phone.jpg",
        description: "256GB, Pro Camera System",
        category: "phones"
    },
    {
        id: 6,
        name: "Pro Tablet",
        price: 87999,
        image: "images/tablet.jpg",
        description: "12.9-inch Display, 256GB",
        category: "phones"
    },
    // Audio Category
    {
        id: 7,
        name: "Wireless Earbuds",
        price: 27499,
        image: "images/earbuds.jpg",
        description: "Active Noise Cancellation",
        category: "Audio"
    },
    {
        id: 8,
        name: "Premium Headphones",
        price: 38499,
        image: "images/headphones.jpg",
        description: "Wireless Noise Cancelling",
        category: "Audio"
    },
    // Gaming Category
    {
        id: 9,
        name: "Gaming Console",
        price: 54999,
        image: "images/console.jpg",
        description: "Next-Gen Gaming Console",
        category: "Gaming"
    },
    {
        id: 10,
        name: "Gaming Headset",
        price: 14299,
        image: "images/headset.jpg",
        description: "7.1 Surround Sound",
        category: "Gaming"
    },
    // Accessories Category
    {
        id: 11,
        name: "Wireless Mouse",
        price: 8799,
        image: "images/mouse.jpg",
        description: "Gaming Grade Sensor",
        category: "accessories"
    },
    {
        id: 12,
        name: "Mechanical Keyboard",
        price: 16499,
        image: "images/keyboard.jpg",
        description: "RGB Mechanical Switches",
        category: "accessories"
    },
    // Smart Home Category
    {
        id: 13,
        name: "Smart Hub",
        price: 14299,
        image: "images/smarthub.jpg",
        description: "Control Your Home",
        category: "smart-home"
    },
    {
        id: 14,
        name: "Smart Doorbell",
        price: 21999,
        image: "images/doorbells.jpg",
        description: "HD Camera with Night Vision",
        category: "smart-home"
    },
    // Cameras Category
    {
        id: 15,
        name: "Action Camera",
        price: 43999,
        image: "images/action-cam.jpg",
        description: "4K 60fps Waterproof",
        category: "cameras"
    },
    {
        id: 16,
        name: "Security Camera",
        price: 32999,
        image: "images/camera-security.jpg",
        description: "1080p Night Vision",
        category: "cameras"
    }
];

// Shopping cart state
let cart = [];
const SHIPPING_COST = 9.99;
const COUPON_CODES = {
    'NAZIMSIR': 0.10  // 10% discount
};
let appliedCoupon = null;

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const shippingEl = document.getElementById('shipping');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkoutBtn');
const couponInput = document.getElementById('couponCode');
const applyCouponBtn = document.getElementById('applyCoupon');

// Mobile menu functionality
const menuBtn = document.getElementById('menuBtn');
const mobileSidebar = document.getElementById('mobileSidebar');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');

menuBtn.addEventListener('click', () => {
    mobileSidebar.classList.remove('translate-x-full');
});

closeSidebarBtn.addEventListener('click', () => {
    mobileSidebar.classList.add('translate-x-full');
});

// Cart sidebar functionality
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCartBtn = document.getElementById('closeCartBtn');

cartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('translate-x-full');
});

closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('translate-x-full');
});

// Initialize products and category filter
function initializeProducts(category = 'all') {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card group relative overflow-hidden rounded-lg bg-gray-800 hover:bg-gray-750 transition-all duration-500 w-full max-w-xs">
            <div class="aspect-[4/3] overflow-hidden">
                <img src="${product.image}" alt="${product.name}" 
                     class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500">
            </div>
            <div class="absolute top-2 left-2 z-10">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 bg-opacity-90 text-white">
                    ${product.category}
                </span>
            </div>
            <div class="p-4 relative">
                <h3 class="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">${product.name}</h3>
                <p class="text-gray-400 text-xs mb-3 line-clamp-2">${product.description}</p>
                <div class="flex items-center justify-between">
                    <span class="text-lg font-bold text-white">৳${product.price.toLocaleString()}</span>
                    <button onclick="addToCart(${product.id})" 
                            class="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-sm transition-all duration-300 transform group-hover:scale-105">
                        <i class="fas fa-shopping-cart text-sm"></i>
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500">
                No products found in this category.
            </div>
        `;
    }
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item flex items-center border-b pb-4">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
            <div class="ml-4 flex-grow">
                <h4 class="font-semibold">${item.name}</h4>
                <div class="flex items-center mt-2">
                    <button onclick="updateQuantity(${item.id}, -1)" class="quantity-btn px-2 py-1 rounded border">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="quantity-btn px-2 py-1 rounded border">+</button>
                </div>
            </div>
            <div class="ml-4">
                <p class="font-semibold">৳${(item.price * item.quantity).toLocaleString()}</p>
                <button onclick="removeFromCart(${item.id})" class="text-red-500 text-sm mt-2">Remove</button>
            </div>
        </div>
    `).join('');

    updateTotals();
}

function updateTotals() {
    const subtotal = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product.price * item.quantity);
    }, 0);

    const shipping = subtotal > 0 ? shippingCost : 0;
    let finalTotal = subtotal + shipping;
    const discountRow = document.getElementById('discountRow');
    const discountEl = document.getElementById('discount');

    if (appliedCoupon) {
        const discountAmount = finalTotal * couponCodes[appliedCoupon];
        finalTotal -= discountAmount;
        discountRow.classList.remove('hidden');
        discountEl.textContent = `-৳${(discountAmount * 110).toFixed(0)}`;
    } else {
        discountRow.classList.add('hidden');
        discountEl.textContent = '-৳0';
    }

    subtotalEl.textContent = `৳${(subtotal * 110).toFixed(0)}`;
    shippingEl.textContent = `৳${shipping}`;
    totalEl.textContent = `৳${(finalTotal * 110).toFixed(0)}`;
}

// Coupon codes
const couponCodes = {
    'NAZIMSIR': 0.10  // 10% discount
};

// Shipping costs
const shippingCost = 50;

// Coupon functionality
applyCouponBtn.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();
    
    if (couponCodes[code]) {
        appliedCoupon = code;
        const discountPercent = couponCodes[code] * 100;
        alert(`Coupon applied! You get ${discountPercent}% off your order.`);
        updateTotals();
    } else {
        alert('Invalid coupon code.');
    }

    couponInput.classList.toggle('border-red-500', !couponCodes[code]);
    couponInput.classList.toggle('border-green-500', couponCodes[code]);
});

// Checkout functionality
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Thank you for your purchase!');
    cart = [];
    appliedCoupon = null;
    updateCart();
    cartSidebar.classList.add('translate-x-full');
});

// Category filter functionality
const categoryFilter = document.getElementById('categoryFilter');
categoryFilter.addEventListener('change', (e) => {
    initializeProducts(e.target.value);
});

// Category cards functionality
const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        const category = card.querySelector('h3').textContent;
        // Handle 'TVs & Monitors' special case
        const filterValue = category === 'TVs & Monitors' ? 'TVs' : category;
        categoryFilter.value = filterValue;
        initializeProducts(filterValue);
        
        // Smooth scroll to products section
        document.querySelector('#productGrid').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Banner Slider functionality
let currentSlide = 0;
const banner = document.getElementById('banner');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dots = document.querySelectorAll('.banner-dot');
const totalSlides = 3;

function updateBanner() {
    banner.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('bg-opacity-100', index === currentSlide);
        dot.classList.toggle('bg-opacity-50', index !== currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateBanner();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateBanner();
}

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetTimer();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetTimer();
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateBanner();
        resetTimer();
    });
});

let slideTimer = setInterval(nextSlide, 5000);

function resetTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, 5000);
}

// Category functionality
const categories = document.querySelectorAll('.category-item');
const featuredContainer = document.getElementById('categoryFeatured');
let activeCategory = null;

// Handle category clicks
categories.forEach(category => {
    category.addEventListener('click', () => {
        const categoryId = category.dataset.category;
        const categoryProducts = products.filter(p => p.category === categoryId);
        console.log('Category clicked:', categoryId);
        console.log('Found products:', categoryProducts);
        
        // Remove active class from previous category
        if (activeCategory) {
            activeCategory.classList.remove('active');
        }
        
        // If clicking the same category, hide products
        if (activeCategory === category) {
            featuredContainer.classList.remove('active');
            featuredContainer.innerHTML = '';
            activeCategory = null;
            return;
        }
        
        // Add active class to clicked category
        category.classList.add('active');
        activeCategory = category;
        
        // Show featured products (limit to 2)
        const featuredProducts = categoryProducts.slice(0, 2);
        featuredContainer.innerHTML = `
            <div class="text-center mb-6">
                <h3 class="text-xl font-bold text-blue-400">Featured ${category.querySelector('.category-name').textContent}</h3>
                <p class="text-gray-400 text-sm mt-1">Our top picks just for you</p>
            </div>
            <div class="featured-products-grid">
                ${featuredProducts.map(product => `
                    <div class="featured-product-card">
                        <div class="featured-product-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="featured-product-info">
                            <h3 class="text-lg font-semibold">${product.name}</h3>
                            <p class="text-sm text-gray-400 mt-1">${product.description}</p>
                            <div class="featured-product-price">
                                <span class="text-2xl font-bold text-blue-400">৳${product.price.toLocaleString()}</span>
                                <span class="text-sm text-gray-400">+ ৳${shippingCost} shipping</span>
                            </div>
                            <button onclick="addToCart(${product.id})" class="featured-product-button">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        featuredContainer.classList.add('active');
    });
});

// Initialize the page
initializeProducts();
updateBanner();
