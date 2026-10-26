
// Store data
let products = [];
let cart = JSON.parse(localStorage.getItem("shopeasy-cart") || "[]");

// Display product cards in the product grid.
function displayProducts(list) {
    const grid = document.querySelector("#product-grid");
    if (!grid) return;

    grid.innerHTML = "";

    if (list.length === 0) {
        grid.innerHTML = "<p>No products found.</p>";
        return;
    }

    list.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>Rating: ★ ${product.rating}/5</p>
                <p class="price">Rs. ${product.price}</p>
                <button class="add-button"
                    data-action="add" data-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Search products by name without case sensitivity.
function searchProducts(list, text) {
    return list.filter(product =>
        product.name.toLowerCase().includes(text.toLowerCase().trim())
    );
}

// Filter products by category.
function filterByCategory(list, category) {
    if (category === "all") return [...list];

    return list.filter(product => product.category === category);
}

// Return a sorted copy of products by price.
function sortProducts(list, order) {
    const copiedList = [...list];

    if (order === "low") {
        return copiedList.sort((a, b) => a.price - b.price);
    }

    if (order === "high") {
        return copiedList.sort((a, b) => b.price - a.price);
    }

    return copiedList;
}

// Find a product using its ID.
function getProductById(list, id) {
    return list.find(product => product.id === Number(id))
        || "Product not found";
}

// Add a product to the cart or increase its quantity.
function addToCart(id) {
    const product = getProductById(products, id);

    if (product === "Product not found") return;

    const existing = cart.find(item => item.id === Number(id));

    if (existing) {
        cart = cart.map(item =>
            item.id === Number(id)
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
    } else {
        cart = [...cart, { ...product, quantity: 1 }];
    }

    saveCart();
}

// Remove a product from the cart.
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== Number(id));
    saveCart();

    return cart;
}

// Update quantity and remove items when quantity reaches zero.
function updateQuantity(id, change) {
    cart = cart
        .map(item => item.id === Number(id)
            ? { ...item, quantity: item.quantity + change }
            : item)
        .filter(item => item.quantity > 0);

    saveCart();

    return cart;
}

// Calculate the total cost of the cart.
function getCartTotal(cartItems) {
    return cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
}

// Calculate the total after applying a percentage discount.
function calculateBill(discount, ...prices) {
    const total = prices.reduce((sum, price) => sum + price, 0);

    return total - (total * discount / 100);
}

// Validate checkout fields and display error messages.
function validateCheckout() {
    const fields = [
        {
            id: "full-name",
            error: "name-error",
            message: "Enter at least 3 characters."
        },
        {
            id: "email",
            error: "email-error",
            message: "Enter a valid email."
        },
        {
            id: "phone",
            error: "phone-error",
            message: "Enter a valid phone number."
        },
        {
            id: "city",
            error: "city-error",
            message: "Select your city."
        },
        {
            id: "address",
            error: "address-error",
            message: "Enter an address of at least 10 characters."
        }
    ];

    let valid = true;

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        const error = document.getElementById(field.error);

        if (!input.checkValidity() || input.value.trim() === "") {
            error.textContent = field.message;
            valid = false;
        } else {
            error.textContent = "";
        }
    });

    return valid;
}

// Save cart data in localStorage.
function saveCart() {
    localStorage.setItem("shopeasy-cart", JSON.stringify(cart));
}