document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token'); // Elimina el token de autenticación, si estás usando uno
        window.location.href = '/'; // Redirige al usuario a la página principal
    });

    document.getElementById('addProductForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('productName').value;
        const description = document.getElementById('productDescription').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const quantity = parseInt(document.getElementById('productQuantity').value);

        if (!name || !description || isNaN(price) || isNaN(quantity)) {
            alert('Todos los campos son obligatorios');
            return;
        }

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, price, quantity })
            });

            if (!response.ok) {
                throw new Error('Error al agregar el producto');
            }

            alert('Producto agregado exitosamente');
            loadProducts(); // Recargar la lista de productos
        } catch (error) {
            console.error(error);
            alert('Hubo un problema al agregar el producto');
        }
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
