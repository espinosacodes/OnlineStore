document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token'); // Elimina el token de autenticación, si estás usando uno
        window.location.href = '/'; // Redirige al usuario a la página principal
    });
});

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
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
            `;
            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error(error);
        alert('Hubo un problema al cargar la lista de productos');
    }
}
