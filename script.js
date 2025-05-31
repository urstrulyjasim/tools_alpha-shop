// Product data
let products = [];

// Fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        products = data.products;
        initializeProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Product details modal
function showProductDetails(product) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="bg-gray-800 p-8 rounded-lg max-w-4xl w-full mx-4 relative overflow-y-auto max-h-[90vh]">
            <button class="absolute top-4 right-4 text-gray-400 hover:text-white">
                <i class="fas fa-times text-xl"></i>
            </button>
            <div class="flex flex-col md:flex-row gap-8">
                <div class="md:w-1/2">
                    <div class="sticky top-0">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-auto rounded-lg shadow-lg mb-6">
                        <div class="bg-gray-900 p-6 rounded-lg">
                            <div class="flex justify-between items-center mb-4">
                                <div>
                                    <p class="text-3xl font-bold text-blue-400">৳${product.price.toLocaleString()}</p>
                                    <p class="text-sm text-gray-400">+ ৳${shippingCost} shipping</p>
                                </div>
                                <div class="text-right">
                                    <span class="inline-flex items-center px-3 py-1 rounded-full bg-green-500 bg-opacity-20 text-green-400 text-sm">
                                        <i class="fas fa-check-circle mr-1"></i> In Stock
                                    </span>
                                </div>
                            </div>
                            <button onclick="addToCart(${product.id})" class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center text-lg font-semibold">
                                <i class="fas fa-shopping-cart mr-2"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
                <div class="md:w-1/2">
                    <h2 class="text-3xl font-bold mb-2">${product.name}</h2>
                    <p class="text-gray-300 text-lg mb-6">${product.description}</p>
                    
                    <div class="space-y-6">
                        <div>
                            <h3 class="text-xl font-semibold mb-3 flex items-center">
                                <i class="fas fa-info-circle text-blue-400 mr-2"></i> Product Information
                            </h3>
                            <div class="bg-gray-900 p-4 rounded-lg">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-gray-400 text-sm">Category</p>
                                        <p class="font-medium">${product.category}</p>
                                    </div>
                                    <div>
                                        <p class="text-gray-400 text-sm">Brand</p>
                                        <p class="font-medium">${product.name.split(' ')[0]}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-xl font-semibold mb-3 flex items-center">
                                <i class="fas fa-microchip text-blue-400 mr-2"></i> Technical Specifications
                            </h3>
                            <div class="bg-gray-900 p-4 rounded-lg">
                                <div class="grid gap-4">
                                    ${Object.entries(product.specs || {}).map(([key, value]) => `
                                        <div>
                                            <p class="text-gray-400 text-sm">${key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}</p>
                                            <p class="font-medium">${value}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-xl font-semibold mb-3 flex items-center">
                                <i class="fas fa-truck text-blue-400 mr-2"></i> Shipping Information
                            </h3>
                            <div class="bg-gray-900 p-4 rounded-lg">
                                <div class="space-y-3">
                                    <div class="flex items-center">
                                        <i class="fas fa-box text-gray-400 mr-3"></i>
                                        <div>
                                            <p class="font-medium">Free shipping</p>
                                            <p class="text-sm text-gray-400">For orders above ৳5000</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center">
                                        <i class="fas fa-clock text-gray-400 mr-3"></i>
                                        <div>
                                            <p class="font-medium">Delivery time</p>
                                            <p class="text-sm text-gray-400">2-4 business days</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center">
                                        <i class="fas fa-shield-alt text-gray-400 mr-3"></i>
                                        <div>
                                            <p class="font-medium">Warranty</p>
                                            <p class="text-sm text-gray-400">1 year manufacturer warranty</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Close modal when clicking outside or on close button
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('button.absolute')) {
            modal.remove();
        }
    });

    document.body.appendChild(modal);
}



// ekhane shipping cost are coupon er kaj korechi
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

// Cart sidebar
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCartBtn = document.getElementById('closeCartBtn');

cartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('translate-x-full');
});

closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('translate-x-full');
});



function initializeProducts(category = 'all') {
    if (products.length === 0) return; // Don't initialize if products haven't been fetched yet

    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card group relative overflow-hidden rounded-lg bg-gray-800 hover:bg-gray-750 transition-all duration-500 w-full max-w-xs cursor-pointer" onclick="showProductDetails(${JSON.stringify(product).replace(/"/g, '&quot;')})">
            <div class="aspect-w-1 aspect-h-1">
                <img src="${product.image}" alt="${product.name}" class="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500">
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
                <p class="text-gray-400 text-sm mb-4">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-2xl font-bold">৳${product.price.toFixed(2)}</span>
                    <button onclick="event.stopPropagation(); addToCart(${product.id})" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        Add to Cart
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

// Review functionality
const addReviewBtn = document.getElementById('addReviewBtn');
const reviewModal = document.getElementById('reviewModal');
const closeReviewModal = document.getElementById('closeReviewModal');
const reviewForm = document.getElementById('reviewForm');
const stars = document.querySelectorAll('[data-rating]');
let currentRating = 0;

// Show/hide review modal
addReviewBtn.addEventListener('click', () => {
    reviewModal.classList.remove('hidden');
});

closeReviewModal.addEventListener('click', () => {
    reviewModal.classList.add('hidden');
});

// Handle star rating
stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        const rating = parseInt(star.dataset.rating);
        updateStars(rating);
    });

    star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.rating);
        updateStars(currentRating);
    });
});

const starContainer = stars[0].parentElement;
starContainer.addEventListener('mouseleave', () => {
    updateStars(currentRating);
});

function updateStars(rating) {
    stars.forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        if (starRating <= rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

// Handle review submission
reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('reviewName').value;
    const comment = document.getElementById('reviewComment').value;
    
    if (name && comment && currentRating > 0) {
        // Create new review card
        const reviewsGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
        const newReview = document.createElement('div');
        newReview.className = 'bg-gray-800 p-6 rounded-lg shadow-lg';
        
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
        const randomColor = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500'][Math.floor(Math.random() * 5)];
        
        newReview.innerHTML = `
            <div class="flex items-center mb-4">
                <div class="w-12 h-12 ${randomColor} rounded-full flex items-center justify-center text-xl font-bold text-white">${initials}</div>
                <div class="ml-4">
                    <h3 class="font-semibold">${name}</h3>
                    <div class="flex text-yellow-400">
                        ${'<i class="fas fa-star"></i>'.repeat(currentRating)}
                        ${'<i class="far fa-star"></i>'.repeat(5 - currentRating)}
                    </div>
                </div>
            </div>
            <p class="text-gray-300">"${comment}"</p>
        `;
        
        reviewsGrid.insertBefore(newReview, reviewsGrid.firstChild);
        
        // Reset form
        reviewForm.reset();
        currentRating = 0;
        updateStars(0);
        reviewModal.classList.add('hidden');
    }
});

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

const categories = document.querySelectorAll('.category-item');
let activeCategory = null;

// Initialize products and category filter
function initializeProducts(category = 'all') {
    if (products.length === 0) return; // Don't initialize if products haven't been fetched yet

    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category.toLowerCase() === category.toLowerCase());

    // Remove active class from previous category
    if (activeCategory) {
        activeCategory.classList.remove('active');
    }

    // Add active class to clicked category
    if (category !== 'all') {
        categories.forEach(cat => {
            if (cat.dataset.category === category) {
                cat.classList.add('active');
                activeCategory = cat;
            }
        });
    }

    // Show all products in the product grid
    const productGrid = document.getElementById('productGrid');
    productGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4';
    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card cursor-pointer" onclick="showProductDetails(${JSON.stringify(product).replace(/"/g, '&quot;')})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="text-lg font-semibold">${product.name}</h3>
                <p class="text-sm text-gray-400 mt-1">${product.description}</p>
                <div class="product-price">
                    <span class="text-2xl font-bold text-blue-400">৳${product.price.toLocaleString()}</span>
                    <span class="text-sm text-gray-400">+ ৳${shippingCost} shipping</span>
                </div>
                <button onclick="event.stopPropagation(); addToCart(${product.id})" class="product-button">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Handle category clicks
categories.forEach(category => {
    category.addEventListener('click', () => {
        const categoryId = category.dataset.category;
        
        // Initialize products for this category
        initializeProducts(categoryId);
        
        // Smooth scroll to products section
        document.querySelector('#productGrid').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Initialize the page
fetchProducts();
updateBanner();
