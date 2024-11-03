// Obtener productos
fetch('/api/products')
    .then(response => response.json())
    .then(data => {
        const productsDiv = document.getElementById('products');
        data.forEach(product => {
            const productElem = document.createElement('div');
            productElem.innerHTML = `<h2>${product.name}</h2><p>${product.description}</p><p>Price: $${product.price}</p>`;
            productsDiv.appendChild(productElem);
        });
    });
