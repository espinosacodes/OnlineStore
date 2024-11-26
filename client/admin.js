document.addEventListener('DOMContentLoaded', () => {
  loadProducts();

  document.getElementById('addProductForm').addEventListener('submit', addProduct);
  document.getElementById('logout-btn').addEventListener('click', logout);
});

async function addProduct(e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', document.getElementById('name').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('price', document.getElementById('price').value);
  formData.append('quantity', document.getElementById('quantity').value);
  formData.append('image', document.getElementById('image').files[0]);

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/products/add', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      alert('Producto añadido exitosamente!');
      loadProducts();
      document.getElementById('addProductForm').reset();
    } else {
      alert(data.message || 'Error al añadir el producto');
    }
  } catch (error) {
    console.error('Error al añadir el producto:', error);
    alert('Error al añadir el producto');
  }
}

async function loadProducts() {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    const products = await response.json();

    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    products.forEach((product) => {
      const productElement = document.createElement('div');
      productElement.classList.add('product-item');
      productElement.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>Precio:</strong> $${product.price}</p>
        <p><strong>Cantidad:</strong> ${product.quantity}</p>
      `;
      tableBody.appendChild(productElement);
    });
  } catch (error) {
    console.error('Error al cargar los productos:', error);
  }
}

function logout() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}

