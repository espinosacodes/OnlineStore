// client/js/history.js
async function loadPurchaseHistory() {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:3000/api/purchase/history', {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    });

    const purchases = await response.json();

    const historyContainer = document.getElementById('historyContainer');
    historyContainer.innerHTML = purchases.map(purchase => `
        <div class="purchase-item">
            <h3>Factura #${purchase.id}</h3>
            <p>Fecha: ${new Date(purchase.date).toLocaleString()}</p>
            <p>Total: $${purchase.total}</p>
            <ul>
                ${purchase.items.map(item => `
                    <li>${item.name} - Cantidad: ${item.quantity} - Precio: $${item.price}</li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', loadPurchaseHistory);