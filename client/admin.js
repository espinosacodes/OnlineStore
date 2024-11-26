document.getElementById('addProductForm').addEventListener('submit', async (e) => {
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
        alert('Product added successfully!');
        // Optionally reload the product list
        loadProducts();
      } else {
        alert(data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  });
  
  // Load products and display them in a table
  async function loadProducts() {
    try {
      const response = await fetch('http://localhost:3000/api/products');
      const products = await response.json();
  
      const tableBody = document.getElementById('productTableBody');
      tableBody.innerHTML = '';
  
      products.forEach((product) => {
        const row = `
          <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>${product.quantity}</td>
            <td><img src="${product.imageUrl}" alt="${product.name}" width="50"></td>
          </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
      });
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }
  
  // Load products on page load
  loadProducts();
  