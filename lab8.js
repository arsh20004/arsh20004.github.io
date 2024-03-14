let cartItems = [];

function addToCart(productName, price) {
    cartItems.push({ name: productName, price: price });
    displayCart();
}

function displayCart() {
    const cartElement = document.querySelector('#cart');
    const cartCountElement = document.querySelector('#cartCount');
    const cartDetails = document.querySelector('#cartDetails');
    const totalPriceElement = document.getElementById('totalPrice');

    cartElement.innerHTML = '';
    let totalPrice = 0;
    let productCount = {};

    cartItems.forEach(item => {
        if (productCount[item.name]) {
            productCount[item.name]++;
        } else {
            productCount[item.name] = 1;
        }
        totalPrice += item.price;
    });

    cartCountElement.textContent = cartItems.length;

    for (let productName in productCount) {
        const amount = productCount[productName];
        const li = document.createElement('li');
        const unitPrice = cartItems.find(item => item.name === productName).price;
        const totalProductPrice = unitPrice * amount;
        li.textContent = `${productName} - Amount: ${amount}, Unit Price: $${unitPrice}, Total: $${totalProductPrice}`;
        cartElement.appendChild(li);
    }

    totalPriceElement.textContent = `Total Price: $${totalPrice}`;
}

function toggleCartDetails() {
    const cartDetails = document.querySelector('#cartDetails');
    if (cartDetails.style.display === 'none') {
        cartDetails.style.display = 'block';
    } else {
        cartDetails.style.display = 'none';
    }
}

function calculateTotalPrice() {
    let totalPrice = 0;
    cartItems.forEach(item => {
        totalPrice += item.price;
    }); 
    return totalPrice;
}

document.addEventListener('DOMContentLoaded', function() {
    const cartDetails = document.querySelector('#cartDetails');
    cartDetails.style.display = 'none';

    document.querySelector('#showHideCart').onclick = toggleCartDetails;

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.onclick = function() {
            const productName = button.getAttribute('data-product');
            const productPrice = parseFloat(button.getAttribute('data-price'));
            addToCart(productName, productPrice);
        };
    });

    const submitButton = document.getElementById('submit');
    submitButton.onclick = function() {
        const firebaseBaseUrl = 'https://comp165rocks-default-rtdb.firebaseio.com/orders.json';
        const timestamp = new Date().toISOString();
        const orderData = {
            timestamp: timestamp,
            items: cartItems,
            totalPrice: calculateTotalPrice()
        };

        fetch(firebaseBaseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => {
            if (response.ok) {
                alert('Order submitted successfully!');
            } else {
                throw new Error('Failed to submit order');
            }
        })
        .catch(error => {
            console.error('Error submitting order:', error);
            alert('An error occurred while submitting the order. Please try again.');
        });
    };
});
