document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    document.getElementById('logout').addEventListener('click', () => {
        window.location.href = '/';
    });

    document.getElementById('addProductForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('productName').value;
        const description = document.getElementById('productDescription').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const quantity = parseInt(document.getElementById('productQuantity').value);

        const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, price, quantity }),
        });

        if (response.ok) {
            alert('Producto agregado exitosamente');
            loadProducts(); // Recargar la lista de productos
        } else {
            alert('Error al agregar el producto');
        }

        document.getElementById('addProductForm').reset();
    });

    async function loadProducts() {
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
            `;
            productList.appendChild(productItem);
        });
    }
});
