document.addEventListener('DOMContentLoaded', function () {
    let donationAmount = document.getElementById('donation-amount').value || 10.00;
    console.log('Initial Donation Amount:', donationAmount); // Log the initial donation amount

    // Update donation amount dynamically
    document.getElementById('donation-amount').addEventListener('input', function () {
        donationAmount = parseFloat(this.value) || 10.00;
        console.log('Updated Donation Amount:', donationAmount); // Log updated amount
        renderPayPalButton(); // Re-render the button with the updated amount
    });

    function renderPayPalButton() {
        if (typeof paypal === 'undefined') {
            console.error("PayPal SDK failed to load.");
            return; // Exit if PayPal SDK is not loaded
        }

        console.log('Rendering PayPal Button'); // Log before rendering the button

        document.getElementById('paypal-button-container').innerHTML = ''; // Clear previous button

        paypal.Buttons({
            createOrder: function (data, actions) {
                console.log('Creating Order with Amount:', donationAmount.toFixed(2)); // Log amount before order creation
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: donationAmount.toFixed(2) // Use updated amount
                        }
                    }]
                });
            },
            onApprove: function (data, actions) {
                console.log('Transaction Approved:', data); // Log transaction approval
                return actions.order.capture().then(function (details) {
                    alert('Donation successful! Thank you, ' + details.payer.name.given_name);
                });
            },
            onError: function (err) {
                console.error('Error in PayPal transaction', err); // Log any errors
                alert('An error occurred. Please try again.');
            }
        }).render('#paypal-button-container');
    }

    renderPayPalButton(); // Initial render of the PayPal button
});
