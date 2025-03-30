document.addEventListener('DOMContentLoaded', function () {
    let donationAmount = document.getElementById('donation-amount').value || 10.00;

    // Update donation amount dynamically
    document.getElementById('donation-amount').addEventListener('input', function () {
        donationAmount = parseFloat(this.value) || 10.00;
        renderPayPalButton(); // Re-render the button
    });

    function renderPayPalButton() {
        document.getElementById('paypal-button-container').innerHTML = ''; // Clear previous button

        paypal.Buttons({
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: donationAmount.toFixed(2) // Use updated amount
                        }
                    }]
                });
            },
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    alert('Donation successful! Thank you, ' + details.payer.name.given_name);
                });
            },
            onError: function (err) {
                console.error('Error in PayPal transaction', err);
                alert('An error occurred. Please try again.');
            }
        }).render('#paypal-button-container');
    }

    renderPayPalButton(); // Initial render
});
