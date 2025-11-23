// CONFIGURACIÓN
const ALIAS = "tecnicamario"; // tu alias MODO/transferencia
const NUMERO_WHATSAPP = "1153142220"; // sin 0, sin 15

const carrito = [];

// FORMATEAR PRECIOS
function formatearPrecio(valor) {
    return "$" + valor.toLocaleString("es-AR");
}

// ACTUALIZAR CARRITO EN HTML
function renderCarrito() {
    const lista = document.getElementById("carrito-lista");
    const totalSpan = document.getElementById("carrito-total-valor");
    const btnWhatsapp = document.getElementById("btn-whatsapp");

    lista.innerHTML = "";

    if (carrito.length === 0) {
        const li = document.createElement("li");
        li.classList.add("carrito-vacio");
        li.textContent = "Todavía no agregaste nada al carrito.";
        lista.appendChild(li);
        totalSpan.textContent = "$0";
        btnWhatsapp.disabled = true;
        return;
    }

    let total = 0;

    carrito.forEach((item, index) => {
        const li = document.createElement("li");
        li.classList.add("carrito-item");

        const texto = document.createElement("span");
        texto.innerHTML = `<strong>${item.nombre}</strong> x${item.cantidad} <br><small>${formatearPrecio(item.precio)} c/u</small>`;

        const subtotal = document.createElement("small");
        const subtotalValor = item.precio * item.cantidad;
        subtotal.textContent = formatearPrecio(subtotalValor);
        total += subtotalValor;

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "✕";
        btnEliminar.title = "Quitar";
        btnEliminar.addEventListener("click", () => {
            carrito.splice(index, 1);
            renderCarrito();
        });

        li.appendChild(texto);
        li.appendChild(subtotal);
        li.appendChild(btnEliminar);
        lista.appendChild(li);
    });

    totalSpan.textContent = formatearPrecio(total);
    btnWhatsapp.disabled = false;
}

// AGREGAR PRODUCTO AL CARRITO
function agregarAlCarrito(nombre, precio, cantidad) {
    const cantidadNum = parseInt(cantidad, 10);
    if (isNaN(cantidadNum) || cantidadNum <= 0) return;

    // Si ya existe el producto en el carrito, sumo cantidad
    const existente = carrito.find((item) => item.nombre === nombre);
    if (existente) {
        existente.cantidad += cantidadNum;
    } else {
        carrito.push({ nombre, precio, cantidad: cantidadNum });
    }

    renderCarrito();
}

// ARMAR MENSAJE PARA WHATSAPP
function armarMensajeWhatsapp() {
    if (carrito.length === 0) return "";

let mensaje = "Hola! Quiero hacer este pedido:%0A%0A";


    let total = 0;

    carrito.forEach((item) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `• ${item.nombre} x${item.cantidad} = ${formatearPrecio(subtotal)}%0A`;
    });

    mensaje += `%0ATotal: ${formatearPrecio(total)}%0A%0AMétodos de pago:%0A👉 Transferencia/MODO%0AAlias: ${ALIAS}%0A%0A¿Está disponible para reservar?`;

    return mensaje;
}

// EVENTO BOTÓN WHATSAPP (CARRITO COMPLETO)
function manejarWhatsappPedido() {
    const mensaje = armarMensajeWhatsapp();
    if (!mensaje) return;

    const url = `https://wa.me/549${NUMERO_WHATSAPP}?text=${mensaje}`;
    window.open(url, "_blank");
}

// INICIALIZAR
document.addEventListener("DOMContentLoaded", () => {
    // Año del footer
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Botón de WhatsApp del carrito
    const btnWhatsapp = document.getElementById("btn-whatsapp");
    btnWhatsapp.addEventListener("click", manejarWhatsappPedido);

    // Agregar eventos a cada producto
    const productos = document.querySelectorAll(".producto");
    productos.forEach((producto) => {
        const nombre = producto.dataset.nombre;
        const precio = parseInt(producto.dataset.precio, 10);
        const inputCantidad = producto.querySelector(".cantidad-input");
        const btnAgregar = producto.querySelector(".btn-agregar");

        btnAgregar.addEventListener("click", () => {
            agregarAlCarrito(nombre, precio, inputCantidad.value);
        });
    });
});
