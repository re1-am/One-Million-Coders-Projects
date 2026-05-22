
const shopBtn = document.getElementById("shopbtn");

shopBtn.addEventListener("click", function () {
    const shopSection = document.getElementById("shop");
    window.scrollTo({
        top: shopSection.offsetTop - 50,
        behavior: "smooth"
    });
});


const products = [
    { id: 1, name: "SAMSUNG TV", price: 1000.45, image: "/assets/Images/product1.png" },
    { id: 2, name: "PIXEL 4a", price: 3000.00, image: "/assets/Images/product2.png" },
    { id: 3, name: "PS 5", price: 700.00, image: "/assets/Images/product3.png" },
    { id: 4, name: "MACBOOK AIR", price: 7000.00, image: "/assets/Images/product4.png" },
    { id: 5, name: "APPLE WATCH", price: 7000.00, image: "/assets/Images/product5.png" },
    { id: 6, name: "AIR PODS", price: 7000.00, image: "/assets/Images/product6.png" }
];


let cartItems = [];



function updateCartCount() {
    document.getElementById("cart-count").textContent = cartItems.length;
}



function renderCartTable() {
    const wrapper = document.getElementById("cart-table-wrapper");

    if (cartItems.length === 0) {
        wrapper.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById("total").textContent = "GHC 0.00";
        return;
    }

    const rows = cartItems.map(function (item, index) {
        return `<tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>GHC ${item.price.toFixed(2)}</td>
            <td>
                <div class="qty-ctrl">
                    <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
                </div>
            </td>
            <td>
                <button class="remove-btn" data-action="remove" data-id="${item.id}">✕</button>
            </td>
        </tr>`;
    });

    wrapper.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>S/N</th>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${rows.join("")}
            </tbody>
        </table>
    `;

    const total = cartItems.reduce(function (sum, item) {
        return sum + item.price * item.qty;
    }, 0);

    document.getElementById("total").textContent = "GHC " + total.toFixed(2);
}



function updateProductButtons() {
    const buttons = document.querySelectorAll(".products button[data-id]");

    buttons.forEach(function (btn) {
        const id = parseInt(btn.dataset.id);
        const inCart = cartItems.find(function (item) {
            return item.id === id;
        });

        if (inCart) {
            btn.textContent = "REMOVE FROM CART";
            btn.classList.add("added");
        } else {
            btn.textContent = "ADD TO CART";
            btn.classList.remove("added");
        }
    });
}



function updateCartUI() {
    updateCartCount();
    renderCartTable();
    updateProductButtons();
}



function closeCartFn() {
    document.getElementById("basket").style.display = "none";
}



let toastTimer;
function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        t.classList.remove("show");
    }, 2800);
}



const grid = document.querySelector(".products");

grid.addEventListener("click", function (event) {
    const button = event.target;

    if (!button.matches("button[data-id]")) return;

    const id = parseInt(button.dataset.id);

    const product = products.find(function (item) {
        return item.id === id;
    });

    const existing = cartItems.find(function (item) {
        return item.id === id;
    });

    if (existing) {
        cartItems = cartItems.filter(function (item) {
            return item.id !== id;
        });
    } else {
        cartItems.push({ ...product, qty: 1 });
    }

    updateCartUI();
});



document.getElementById("cart-table-wrapper").addEventListener("click", function (e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const id = parseInt(btn.dataset.id);
    const action = btn.dataset.action;
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    if (action === "inc") {
        item.qty += 1;
    } else if (action === "dec") {
        item.qty -= 1;
        if (item.qty <= 0) cartItems = cartItems.filter(i => i.id !== id);
    } else if (action === "remove") {
        cartItems = cartItems.filter(i => i.id !== id);
    }

    updateCartUI();
});



const cart = document.getElementById("cart");
const basket = document.getElementById("basket");
const continueShoppingBtn = document.getElementById("continue-shopping");
const closeCartBtn = document.getElementById("close-cart");

cart.addEventListener("click", function () {
    basket.style.display = "flex";
    renderCartTable();
});

continueShoppingBtn.addEventListener("click", function () {
    basket.style.display = "none";
});

closeCartBtn.addEventListener("click", function () {
    basket.style.display = "none";
});

basket.addEventListener("click", function (event) {
    if (event.target === basket) {
        basket.style.display = "none";
    }
});



function validateForm() {
    const customername = document.getElementById("customername").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("contact").value.trim();

    if (customername === "") {
        showToast("Please enter your name");
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showToast("Please enter a valid email");
        return false;
    }

    if (!/^\d{10,15}$/.test(phone)) {
        showToast("Please enter a valid phone number");
        return false;
    }

    return true;
}