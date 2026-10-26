
$(document).ready(function () {

    // Load product data from products.json.
    if ($("#product-grid, #featured-products").length) {
        $("#loading-message").text("Loading products...");

        $.getJSON("products.json")
            .done(function (data) {
                products = data;

                $("#loading-message").text("");

                if ($("#product-grid").length) {
                    renderFilteredProducts();
                }

                if ($("#featured-products").length) {
                    $("#featured-products").empty();

                    products.slice(0, 3).forEach(function (product) {
                        const card = `
                            <article class="product-card">
                                <img src="${product.image}" alt="${product.name}">
                                <div class="product-info">
                                    <h3>${product.name}</h3>
                                    <p>Rating: ★ ${product.rating}/5</p>
                                    <p class="price">Rs. ${product.price}</p>
                                    <button class="add-button"
                                        data-action="add"
                                        data-id="${product.id}">
                                        Add to Cart
                                    </button>
                                </div>
                            </article>
                        `;

                        $("#featured-products").append(card);
                    });

                    $("#featured-products .product-card")
                        .hide().fadeIn(300);
                }
            })
            .fail(function () {
                $("#loading-message").text(
                    "Products could not load. Please use Live Server."
                );
            });
    }

    // Open and close FAQ answers with a slide effect.
    $(".faq-question").on("click", function () {
        $(this).next(".faq-answer").slideToggle(200);
    });

    // Search products by name.
    $("#search-input").on("input", function () {
        renderFilteredProducts();
    });

    // Apply category and price filters.
    $("#category-filter, #sort-order").on("change", function () {
        renderFilteredProducts();
    });

    // Handle cart buttons using event delegation.
    $(document).on("click", "[data-action]", function () {
        const id = Number($(this).data("id"));
        const action = $(this).data("action");

        if (action === "add") {
            addToCart(id);

            $("#action-message")
                .text("Product added to cart!")
                .stop(true, true)
                .fadeIn()
                .delay(1000)
                .fadeOut();
        }

        if (action === "plus") {
            updateQuantity(id, 1);
        }

        if (action === "minus") {
            updateQuantity(id, -1);
        }

        if (action === "remove") {
            removeFromCart(id);
        }

        renderCart();
        updateCartCount();
    });

    // Validate the checkout form.
    $("#checkout-form").on("submit", function (event) {
        event.preventDefault();

        if (cart.length === 0) {
            $("#checkout-message")
                .text("Your cart is empty. Add products before checkout.");
            return;
        }

        if (validateCheckout()) {
            $("#checkout-message")
                .text("Checkout form is valid! Demo completed.")
                .hide()
                .fadeIn();
        } else {
            $("#checkout-message")
                .text("Please correct the errors shown in red.")
                .hide()
                .fadeIn();
        }
    });

    // Apply search, category filtering and sorting.
    function renderFilteredProducts() {
        let list = searchProducts(
            products,
            $("#search-input").val() || ""
        );

        list = filterByCategory(
            list,
            $("#category-filter").val() || "all"
        );

        list = sortProducts(
            list,
            $("#sort-order").val() || "default"
        );

        displayProducts(list);

        $("#product-grid .product-card").hide().fadeIn(200);
    }

    // Display cart items and calculate the grand total.
    function renderCart() {
        const tbody = $("#cart-items");

        if (!tbody.length) return;

        tbody.empty();

        if (cart.length === 0) {
            tbody.append(`
                <tr>
                    <td colspan="5">
                        Your cart is empty.
                        <a href="products.html">Browse products</a>
                    </td>
                </tr>
            `);
        } else {
            cart.forEach(function (item) {
                tbody.append(`
                    <tr>
                        <td>${item.name}</td>
                        <td>Rs. ${item.price.toLocaleString()}</td>
                        <td>
                            <button data-action="minus"
                                data-id="${item.id}">-</button>

                            ${item.quantity}

                            <button data-action="plus"
                                data-id="${item.id}">+</button>
                        </td>
                        <td>
                            Rs. ${(item.price * item.quantity)
                                .toLocaleString()}
                        </td>
                        <td>
                            <button data-action="remove"
                                data-id="${item.id}">
                                Remove
                            </button>
                        </td>
                    </tr>
                `);
            });
        }

        $("#grand-total").text(
            "Rs. " + getCartTotal(cart).toLocaleString()
        );
    }

    // Update the cart count in the navigation bar.
    function updateCartCount() {
        const count = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

        $("#cart-count").text(count);
    }

    renderCart();
    updateCartCount();

});
