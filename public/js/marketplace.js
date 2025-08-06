// ===== VARIABLES GLOBALES =====
var carritoVisible = false;
let cart = [];

// ===== INICIALIZACIÓN =====
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}

function ready() {
    // Configurar todos los event listeners
    setupEventListeners();
    loadCart(); // Cargar carrito guardado
}

// ===== CONFIGURACIÓN DE EVENT LISTENERS =====
function setupEventListeners() {
    // Botones de agregar al carrito
    var botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for (var i = 0; i < botonesAgregarAlCarrito.length; i++) {
        var button = botonesAgregarAlCarrito[i];
        button.addEventListener('click', agregarAlCarritoClicked);
    }

    // Botón de pagar
    var btnPagar = document.getElementsByClassName('btn-pagar')[0];
    if (btnPagar) {
        btnPagar.addEventListener('click', pagarClicked);
    }

    // Event delegation para botones dinámicos
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-eliminar') || e.target.closest('.btn-eliminar')) {
            eliminarItemCarrito(e);
        }
        
        if (e.target.classList.contains('sumar-cantidad')) {
            sumarCantidad(e);
        }
        
        if (e.target.classList.contains('restar-cantidad')) {
            restarCantidad(e);
        }
    });
}

// ===== FUNCIONES DEL CARRITO =====

// Agregar producto al carrito
function agregarAlCarritoClicked(event) {
    var button = event.target;
    var item = button.parentElement;
    var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    var precio = item.getElementsByClassName('precio-item')[0].innerText;
    var imagenSrc = item.getElementsByClassName('img-item')[0].src;

    agregarItemAlCarrito(titulo, precio, imagenSrc);
    hacerVisibleCarrito();
}

// Hacer visible el carrito
function hacerVisibleCarrito() {
    carritoVisible = true;
    var carrito = document.getElementsByClassName('carrito')[0];
    carrito.classList.add('activo');

    var contenedor = document.getElementsByClassName('contenedor')[0];
    contenedor.classList.add('carrito-activo');
}

// Agregar item al carrito
function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    var itemsCarrito = document.getElementsByClassName('carrito-items')[0];

    // Check if the item already exists in the cart
    var nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for (var i = 0; i < nombresItemsCarrito.length; i++) {
        if (nombresItemsCarrito[i].innerText == titulo) {
            alert("This item is already in your cart");
            return;
        }
    }

    // Crear nuevo item del carrito
    var item = document.createElement('div');
    var itemCarritoContenido = `
        <div class="carrito-item">
            <img src="${imagenSrc}" width="80px" alt="">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${precio}</span>
            </div>
            <button class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);

    actualizarTotalCarrito();
    saveCart(); // Guardar carrito
}

// Sumar cantidad
function sumarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    actualizarTotalCarrito();
    saveCart(); // Guardar carrito
}

// Restar cantidad
function restarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual--;
    if (cantidadActual >= 1) {
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        actualizarTotalCarrito();
        saveCart(); // Guardar carrito
    }
}

// Eliminar item del carrito
function eliminarItemCarrito(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    actualizarTotalCarrito();
    ocultarCarrito();
    saveCart(); // Guardar carrito
}

// Ocultar carrito si está vacío
function ocultarCarrito() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    if (carritoItems.childElementCount == 0) {
        var carrito = document.getElementsByClassName('carrito')[0];
        carrito.classList.remove('activo');
        carritoVisible = false;

        var contenedor = document.getElementsByClassName('contenedor')[0];
        contenedor.classList.remove('carrito-activo');
    }
}

// Actualizar total del carrito
function actualizarTotalCarrito() {
    var carritoContenedor = document.getElementsByClassName('carrito')[0];
    var carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    var total = 0;
    
    for (var i = 0; i < carritoItems.length; i++) {
        var item = carritoItems[i];
        var precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        var precio = parseFloat(precioElemento.innerText.replace('$', '').replace(',', ''));
        var cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
        var cantidad = parseFloat(cantidadItem.value);
        total = total + (precio * cantidad);
    }
    
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toFixed(2);
}

// Función de pago
function pagarClicked() {
            window.location.href = 'pages/payment.html';
}

// ===== FUNCIONES DE PERSISTENCIA =====
function saveCart() {
    const cartItems = document.querySelectorAll('.carrito-item');
    const cartData = [];
    
    cartItems.forEach(item => {
        cartData.push({
            title: item.querySelector('.carrito-item-titulo').textContent,
            price: item.querySelector('.carrito-item-precio').textContent,
            quantity: item.querySelector('.carrito-item-cantidad').value,
            img: item.querySelector('img').src
        });
    });
    
    localStorage.setItem('cart', JSON.stringify(cartData));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const cartData = JSON.parse(savedCart);
        const itemsCarrito = document.getElementsByClassName('carrito-items')[0];
        
        cartData.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = `
                <div class="carrito-item">
                    <img src="${item.img}" width="80px" alt="">
                    <div class="carrito-item-detalles">
                        <span class="carrito-item-titulo">${item.title}</span>
                        <div class="selector-cantidad">
                            <i class="fa-solid fa-minus restar-cantidad"></i>
                            <input type="text" value="${item.quantity}" class="carrito-item-cantidad" disabled>
                            <i class="fa-solid fa-plus sumar-cantidad"></i>
                        </div>
                        <span class="carrito-item-precio">${item.price}</span>
                    </div>
                    <button class="btn-eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            itemsCarrito.appendChild(itemElement);
        });
        
        if (cartData.length > 0) {
            hacerVisibleCarrito();
            actualizarTotalCarrito();
        }
    }
}

// ===== FUNCIONES ADICIONALES =====

// Función para limpiar el carrito
function limpiarCarrito() {
    const itemsCarrito = document.getElementsByClassName('carrito-items')[0];
    itemsCarrito.innerHTML = '';
    actualizarTotalCarrito();
    ocultarCarrito();
    localStorage.removeItem('cart');
}

// Función para obtener el total de items en el carrito
function getCartItemCount() {
    const carritoItems = document.querySelectorAll('.carrito-item');
    let totalItems = 0;
    
    carritoItems.forEach(item => {
        const cantidad = parseInt(item.querySelector('.carrito-item-cantidad').value);
        totalItems += cantidad;
    });
    
    return totalItems;
}

// Función para actualizar el contador del carrito en el header
function updateCartCount() {
    const cartCount = getCartItemCount();
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'block' : 'none';
    }
}

// Actualizar contador del carrito cuando se modifica
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar contador inicial
    updateCartCount();
    
    // Observar cambios en el carrito
    const carritoItems = document.querySelector('.carrito-items');
    if (carritoItems) {
        const observer = new MutationObserver(function() {
            updateCartCount();
        });
        
        observer.observe(carritoItems, {
            childList: true,
            subtree: true
        });
    }
}); 