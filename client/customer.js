document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadPurchaseHistory();

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token'); // Elimina el token de autenticación
        window.location.href = '/'; // Redirige al inicio
    });

    document.getElementById('purchase').addEventListener('click', async () => {
        // Realizar compra (Generar factura y guardar en el historial)
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        await fetch('/api/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cart }),
        });

        localStorage.removeItem('cart');
        loadPurchaseHistory();
    });
});

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        const productList = document.getElementById('productList');
        productList.innerHTML = ''; // Limpiar la lista antes de cargar los productos

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <h3>${product.name}</h3>
                <p>Descripción: ${product.description}</p>
                <p>Precio: $${product.price}</p>
                <p>Cantidad disponible: ${product.quantity}</p>
                <button onclick="addToCart(${product.id})">Añadir al carrito</button>
            `;
            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error('Error al cargar los productos', error);
    }
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Producto añadido al carrito');
}

async function loadPurchaseHistory() {
    const response = await fetch('/api/sales/history');
    const history = await response.json();

    const purchaseHistory = document.getElementById('purchaseHistory');
    purchaseHistory.innerHTML = '';

    history.forEach(purchase => {
        const purchaseItem = document.createElement('div');
        purchaseItem.innerHTML = `
            <h4>Compra ID: ${purchase.id}</h4>
            <p>Total: $${purchase.total}</p>
            <p>Productos: ${purchase.items.map(item => item.name).join(', ')}</p>
        `;
        purchaseHistory.appendChild(purchaseItem);
    });
}