// client/js/checkout.js
async function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const token = localStorage.getItem('token');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const response = await fetch('http://localhost:3000/api/purchase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ items: cart, total })
    });

    const data = await response.json();

    if (response.ok) {
        alert('Compra realizada con éxito');
        localStorage.removeItem('cart');
        window.location.href = 'invoice.html'; // Página para mostrar la factura
    } else {
        alert(data.message || 'Error al realizar la compra');
    }
}

document.getElementById('checkoutButton').addEventListener('click', checkout);