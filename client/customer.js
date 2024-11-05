document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    // Evento para el botón de cerrar sesión
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
});

// Función para cargar productos
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const products = await response.json();
        const productList = document.getElementById('productList');
        productList.innerHTML = '';

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Precio: $${product.price}</p>
                <button onclick="addToCart('${product.id}')">Agregar al carrito</button>
            `;
            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Función para agregar productos al carrito
function addToCart(productId) {
    // Implementar lógica para agregar al carrito
    alert(`Producto ${productId} agregado al carrito`);
}