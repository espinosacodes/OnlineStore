// customer.js
let products = [];
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadCart();
  loadPurchaseHistory();

  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('cart-icon').addEventListener('click', toggleCart);
  document.getElementById('checkout-btn').addEventListener('click', checkout);
  document.querySelector('.close-cart').addEventListener('click', toggleCart);
});

async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Error al obtener los productos');
    }
    products = await response.json();
    displayProducts();
  } catch (error) {
    console.error('Error al cargar los productos:', error);
  }
}

function displayProducts() {
  const productGrid = document.getElementById('product-grid');
  productGrid.innerHTML = '';

  products.forEach(product => {
    const fixedImageUrl = product.imageUrl || '/uploads/default-image.png'; // Ruta de imagen genérica
    const productElement = document.createElement('div');
    productElement.classList.add('product-item');
    productElement.innerHTML = `
      <div class="product-image-container">
        <img 
          src="${fixedImageUrl}" 
          alt="${product.name}" 
          class="product-image" 
          onerror="this.src='/uploads/default-image.png'"
        >
      </div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>Precio:</strong> $${product.price}</p>
      <p><strong>Disponibles:</strong> ${product.quantity}</p>
      <button onclick="addToCart(${product.id})" ${product.quantity === 0 ? 'disabled' : ''}>
        ${product.quantity === 0 ? 'Agotado' : 'Añadir al carrito'}
      </button>
    `;
    productGrid.appendChild(productElement);
  });
}



function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product && product.quantity > 0) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    product.quantity--;
    updateCartDisplay();
    displayProducts();
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');

  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('cart-item');
    itemElement.innerHTML = `
      <span>${item.name} - $${item.price} x ${item.quantity}</span>
      <button onclick="removeFromCart(${item.id})">Eliminar</button>
    `;
    cartItems.appendChild(itemElement);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function removeFromCart(productId) {
  const index = cart.findIndex(item => item.id === productId);
  if (index !== -1) {
    const product = products.find(p => p.id === productId);
    product.quantity += cart[index].quantity;
    cart.splice(index, 1);
    updateCartDisplay();
    displayProducts();
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

function toggleCart() {
  const cartModal = document.getElementById('cart-modal');
  cartModal.style.display = cartModal.style.display === 'none' ? 'block' : 'none';
}

async function checkout() {
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
      alert('Compra realizada con éxito');
      cart = [];
      localStorage.removeItem('cart');
      updateCartDisplay();
      loadProducts();
      loadPurchaseHistory();
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Error al realizar la compra:', error);
    alert('Error al realizar la compra');
  }
}

async function loadPurchaseHistory() {
    try {
      console.log('Iniciando carga del historial de compras...');
      const response = await fetch('/api/sales/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      console.log('Estado de la respuesta:', response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en la respuesta:', errorData);
        throw new Error('Error al obtener el historial de compras');
      }
  
      const history = await response.json();
      console.log('Historial de compras:', history);
  
      const historyItems = document.getElementById('history-items');
      historyItems.innerHTML = '';
  
      if (history.length === 0) {
        historyItems.innerHTML = '<p>No has realizado compras aún.</p>';
        return;
      }
  
      history.forEach(purchase => {
        // Verifica que purchase tiene las propiedades esperadas
        console.log('Procesando compra:', purchase);
  
        const purchaseElement = document.createElement('div');
        purchaseElement.classList.add('purchase-item');
        purchaseElement.innerHTML = `
          <h3>Factura #${purchase.id}</h3>
          <p>Fecha: ${purchase.date ? new Date(purchase.date).toLocaleString() : 'Sin fecha'}</p>
          <p>Total: $${parseFloat(purchase.total).toFixed(2)}</p>
          <ul>
            ${purchase.items.map(item => `
              <li>${item.name} - Cantidad: ${item.quantity} - Precio: $${item.price}</li>
            `).join('')}
          </ul>
        `;
        historyItems.appendChild(purchaseElement);
      });
    } catch (error) {
      console.error('Error al cargar el historial de compras:', error);
      const historyItems = document.getElementById('history-items');
      historyItems.innerHTML = '<p>Error al cargar el historial de compras.</p>';
    }
  }

function logout() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}

function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartDisplay();
  }
}
