// Función para mostrar mensajes de error
function showError(message) {
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
  } else {
      alert(message);
  }
}

// Función para ocultar mensajes de error
function hideError() {
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
      errorElement.style.display = 'none';
  }
}

// Mostrar formulario de registro
function showRegisterForm() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
  hideError();
}

// Mostrar formulario de inicio de sesión
function showLoginForm() {
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
  hideError();
}

// Función para manejar la selección de rol (solo en el formulario de registro)
function handleRoleSelection() {
  const roleOptions = document.querySelectorAll('#register-form .role-option');
  roleOptions.forEach(option => {
      option.addEventListener('click', function() {
          roleOptions.forEach(opt => {
              opt.classList.remove('active');
              opt.setAttribute('aria-checked', 'false');
          });
          this.classList.add('active');
          this.setAttribute('aria-checked', 'true');
      });

      option.addEventListener('keypress', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.click();
          }
      });
  });
}

// Función de registro
function register() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const role = document.querySelector('#register-form .role-option.active').getAttribute('data-role');

  fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
  })
  .then(response => response.json())
  .then(data => {
      if (data.message) {
          showError(data.message);
      } else {
          showLoginForm();
          showError('Registro exitoso. Por favor, inicia sesión.');
      }
  })
  .catch(error => {
      console.error('Error during registration:', error);
      showError('Error en el registro. Por favor, inténtalo de nuevo.');
  });
}

// Función de inicio de sesión
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
      console.log('Response data:', data);
      if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          if (data.role === 'admin') {
              window.location.href = 'admin.html';
          } else {
              window.location.href = 'customer.html';
          }
      } else {
          showError(data.message || 'Error en el inicio de sesión');
      }
  })
  .catch(error => {
      console.error('Error during login:', error);
      showError('Error en la conexión. Por favor, inténtalo de nuevo.');
  });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) {
      loginForm.addEventListener('submit', (event) => {
          event.preventDefault();
          login();
      });
  }

  if (registerForm) {
      registerForm.addEventListener('submit', (event) => {
          event.preventDefault();
          register();
      });
  }

  handleRoleSelection();
});

