const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        showProducts();
    }
});

function register() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // Validación en el frontend
    if (!email || !password) {
        alert('Por favor, completa todos los campos.');
        return; // Detiene la función si falta algún campo
    }

    fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            token = data.token;
            showProducts();
        }
        alert(data.message || 'Usuario creado');
    })
    .catch(error => {
        console.error('Error al registrar:', error);
        alert('Error al registrar el usuario');
    });
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            token = data.token;
            showProducts();
        } else {
            alert('Credenciales incorrectas');
        }
    })
    .catch(error => {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión');
    });
}

function showProducts() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('registro-container').style.display = 'none';
    document.getElementById('productos-container').style.display = 'block';
    fetch(`${API_URL}/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(products => {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${product.nombre}</strong> - $${product.precio}<br>
                <em>${product.descripcion}</em><br>
                Cantidad: ${product.cantidad}<br>
                <button onclick="editProduct('${product._id}')">Editar</button>
                <button onclick="deleteProduct('${product._id}')">Eliminar</button>
            `;
            productList.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Error al obtener productos:', error);
        alert('Error al obtener productos');
    });
}

function addProduct() {
    const nombre = document.getElementById('product-name').value;
    const precio = document.getElementById('product-price').value;
    const descripcion = document.getElementById('product-description').value;
    const cantidad = document.getElementById('product-quantity').value;

    // Validación en el frontend
    if (!nombre || !precio || !cantidad) {
        alert('Por favor, completa los campos requeridos: nombre, precio y cantidad.');
        return; // Detiene la función si falta algún campo requerido
    }

    fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, precio, descripcion, cantidad })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(() => {
        showProducts();  // Muestra los productos actualizados
        clearProductFields();  // Limpia los campos después de agregar el producto
    })
    .catch(error => {
        console.error('Error al agregar el producto:', error);
        alert('Error al agregar el producto: ' + (error.message || 'Verifica la consola para más detalles'));
    });
}


function editProduct(id) {
    const newName = prompt('Nuevo nombre (deja vacío para no cambiar):');
    const newPrice = prompt('Nuevo precio (deja vacío para no cambiar):');
    const newDescription = prompt('Nueva descripción (deja vacío para no cambiar):');
    const newQuantity = prompt('Nueva cantidad (deja vacío para no cambiar):');

    const updates = {};
    if (newName) updates.nombre = newName;
    if (newPrice) updates.precio = newPrice;
    if (newDescription) updates.descripcion = newDescription;
    if (newQuantity) updates.cantidad = newQuantity;

    if (Object.keys(updates).length > 0) {
        fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        })
        .then(() => showProducts())
        .catch(error => {
            console.error('Error al editar el producto:', error);
            alert('Error al editar el producto');
        });
    } else {
        alert('No se realizaron cambios.');
    }
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(() => showProducts())
        .catch(error => {
            console.error('Error al eliminar el producto:', error);
            alert('Error al eliminar el producto');
        });
    }
}

function clearProductFields() {
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('product-quantity').value = '';
}


function logout() {
    localStorage.removeItem('token');
    token = null;
    location.reload();
}