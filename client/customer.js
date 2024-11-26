document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadCart();
  loadPurchaseHistory();

  document.getElementById('logout').addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = '/';
  });

  document.getElementById('purchase').addEventListener('click', async () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (cart.length === 0) {
          alert('El carrito está vacío');
          return;
      }

      try {
          const response = await fetch('/api/sales', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({ cart }),
          });

          if (response.ok) {
              localStorage.removeItem('cart');
              loadCart();
              loadPurchaseHistory();
              loadProducts(); // Actualiza cantidades de productos
              alert('Compra realizada con éxito');
          } else {
              const errorData = await response.json();
              alert(`Error: ${errorData.message}`);
          }
      } catch (error) {
          console.error('Error al realizar la compra:', error);
          alert('Error al realizar la compra');
      }
  });
});

async function loadProducts() {
  try {
      const response = await fetch('/api/products');
      const products = await response.json();

      const productList = document.getElementById('productList');
      productList.innerHTML = ''; // Limpiar la lista antes de agregar productos

      products.forEach(product => {
          const productItem = document.createElement('div');
          productItem.classList.add('product-item');
          productItem.innerHTML = `
              <div class="product-card">
                  <img src="${product.imageUrl}" alt="${product.name}" class="product-image" />
                  <h3>${product.name}</h3>
                  <p>${product.description}</p>
                  <p><strong>Precio:</strong> $${product.price}</p>
                  <p><strong>Cantidad disponible:</strong> ${product.quantity}</p>
                  <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Añadir al carrito</button>
              </div>
          `;
          productList.appendChild(productItem);
      });
  } catch (error) {
      console.error('Error al cargar los productos:', error);
  }
}



function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProduct = cart.find(item => item.id === productId);
  if (existingProduct) {
      existingProduct.quantity += 1;
  } else {
      cart.push({ id: productId, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  alert('Producto añadido al carrito');
}

async function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartList = document.getElementById('cartList');
  cartList.innerHTML = '';

  if (cart.length === 0) {
      cartList.innerHTML = '<p>El carrito está vacío</p>';
      return;
  }

  try {
      const response = await fetch('/api/products');
      const products = await response.json();

      let total = 0;
      cart.forEach(item => {
          const product = products.find(p => p.id === item.id);
          if (product) {
              const itemTotal = product.price * item.quantity;
              total += itemTotal;
              const cartItem = document.createElement('div');
              cartItem.innerHTML = `
                  <p>${product.name} - Cantidad: ${item.quantity} - Precio: $${itemTotal}</p>
                  <button onclick="removeFromCart(${item.id})">Eliminar</button>
              `;
              cartList.appendChild(cartItem);
          }
      });

      const totalElement = document.createElement('div');
      totalElement.innerHTML = `<strong>Total del carrito: $${total}</strong>`;
      cartList.appendChild(totalElement);
  } catch (error) {
      console.error('Error al cargar el carrito:', error);
  }
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

async function loadPurchaseHistory() {
  try {
      const response = await fetch('/api/sales/history', {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
      });
      const history = await response.json();

      const purchaseHistory = document.getElementById('purchaseHistory');
      purchaseHistory.innerHTML = '';

      history.forEach(purchase => {
          const purchaseItem = document.createElement('div');
          purchaseItem.innerHTML = `
              <h4>Compra ID: ${purchase.id}</h4>
              <p>Total: $${purchase.total.toFixed(2)}</p>
              <p>Productos: ${purchase.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</p>
          `;
          purchaseHistory.appendChild(purchaseItem);
      });
  } catch (error) {
      console.error('Error al cargar el historial de compras:', error);
  }
}
