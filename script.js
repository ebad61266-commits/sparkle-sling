// Mock Product Data
const products = [
    { id: 1, name: 'Gold Earrings', category: 'jewelry', price: 75, image: 'https://source.unsplash.com/300x300/?gold-earrings' },
    { id: 2, name: 'Sling Bag', category: 'handbags', price: 120, image: 'https://source.unsplash.com/300x300/?sling-bag' },
    // Add more products as needed
];

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentProduct = null;

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    if (pageId === 'shop') renderProducts();
    if (pageId === 'cart') renderCart();
    if (pageId === 'wishlist') renderWishlist();
    if (pageId === 'product-details' && currentProduct) renderProductDetails(currentProduct);
}

// Render Products
function renderProducts() {
    const grid = document.getElementById('product-grid');
    const search = document.getElementById('search').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const price = document.getElementById('price-filter').value;

    const filtered = products.filter(p => {
        return (p.name.toLowerCase().includes(search)) &&
               (!category || p.category === category) &&
               (!price || (price === '0-50' && p.price <= 50) || (price === '50-100' && p.price > 50 && p.price <= 100) || (price === '100+' && p.price > 100));
    });

    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>$${p.price}</p>
            <button onclick="viewProduct(${p.id})">View Details</button>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
            <button onclick="addToWishlist(${p.id})">Add to Wishlist</button>
        </div>
    `).join('');
}

// Product Details
function viewProduct(id) {
    currentProduct = products.find(p => p.id === id);
    showPage('product-details');
}

function renderProductDetails(product) {
    document.getElementById('product-detail-content').innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h1>${product.name}</h1>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
        <button onclick="addToWishlist(${product.id})">Add to Wishlist</button>
    `;
}

// Cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCounts();
}

function renderCart() {
    document.getElementById('cart-items').innerHTML = cart.map((p, i) => `
        <div>${p.name} - $${p.price} <button onclick="removeFromCart(${i})">Remove</button></div>
    `).join('');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCounts();
}

// Wishlist
function addToWishlist(id) {
    const product = products.find(p => p.id === id);
    if (!wishlist.find(p => p.id === id)) wishlist.push(product);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateCounts();
}

function renderWishlist() {
    document.getElementById('wishlist-items').innerHTML = wishlist.map((p, i) => `
        <div>${p.name} - $${p.price} <button onclick="removeFromWishlist(${i})">Remove</button></div>
    `).join('');
}

function removeFromWishlist(index) {
    wishlist.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderWishlist();
    updateCounts();
}

// Update Counts
function updateCounts() {
    document.getElementById('cart-count').textContent = cart.length;
    document.getElementById('wishlist-count').textContent = wishlist.length;
}

// Form Submissions
document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    alert('Message sent!');
});

document.getElementById('checkout-form').addEventListener('submit', e =>
