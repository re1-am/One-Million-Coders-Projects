// ── Checkout & Paystack ──
document.getElementById("checkout").addEventListener("click", function () {

    // Check cart not empty
    if (cartItems.length === 0) {
        showToast("Your cart is empty!");
        return;
    }

    // Run validation from scripts.js — stops here if invalid
    if (!validateForm()) return;

    const name  = document.getElementById("customername").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("contact").value.trim();

    // Calculate total in pesewas (Paystack uses smallest currency unit)
    const total = cartItems.reduce(function (sum, item) {
        return sum + item.price * item.qty;
    }, 0);
    const amountInPesewas = Math.round(total * 100);

    const handler = PaystackPop.setup({
        key: "pk_test_05487a1eb9f0716706885dcb60af4c8d66473efd",
        email: email,
        amount: amountInPesewas,
        currency: "GHS",
        ref: "EMS_" + Date.now(),
        metadata: {
            custom_fields: [
                { display_name: "Customer Name", value: name },
                { display_name: "Phone",         value: phone }
            ]
        },
        callback: function (response) {
            showToast("Payment successful! Ref: " + response.reference);
            cartItems = [];
            updateCartUI();
            closeCartFn();
            ["customername", "email", "contact"].forEach(function (id) {
                document.getElementById(id).value = "";
            });
        },
        onClose: function () {
            showToast("Payment cancelled.");
        }
    });

    handler.openIframe();
});
