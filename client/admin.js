document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    // Evento para el botón de cerrar sesión
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
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
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: {
                 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name, description, price, quantity })
            });

            if (response.ok) {
                alert('Producto agregado exitosamente');
                loadProducts(); // Recargar la lista de productos
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
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
                <p>Cantidad disponible: ${product.quantity}</p>
            `;
            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}