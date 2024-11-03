document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    // Evento para el botón de cerrar sesión
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token'); // Elimina el token de autenticación
        window.location.href = '/'; // Redirige al inicio
    });

    // Evento para el botón de agregar producto
    document.getElementById('addProduct').addEventListener('click', async () => {
        const name = document.getElementById('productName').value;
        const description = document.getElementById('productDescription').value;
        const price = document.getElementById('productPrice').value;
        const quantity = document.getElementById('productQuantity').value;

        if (!name || !description || !price || !quantity) {
            alert('Todos los campos son obligatorios');
            return;
        }

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, price, quantity }),
            });

            if (response.ok) {
                alert('Producto agregado exitosamente');
                loadProducts(); // Recargar la lista de productos
            } else {
                alert('Error al agregar el producto');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al agregar el producto');
        }
    });
});

// Función para cargar la lista de productos
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
        console.error('Error al cargar los productos:', error);
        alert('Hubo un problema al cargar la lista de productos');
    }
}
