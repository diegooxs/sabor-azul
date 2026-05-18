<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { buildApiUrl } from '../config/api'
import { estadoCarrito } from '../store/carrito'
import { estadoPedidos } from '../store/pedidos'
import { datosUsuario } from '../store/usuario'

const route = useRoute()
const esInicio = computed(() => route.path === '/')

const procesando = ref(false)
const pagoExitoso = ref(false)
const mostrarToastCarrito = ref(false)
const productoToast = ref('')
const mostrarCarritoFlotante = ref(false)
const animarContador = ref(false)
const errorPago = ref('')
const mensajePago = ref('')
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''

let timeoutToast
let timeoutContador

const obtenerProductosPedido = () =>
  estadoCarrito.items.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    precio: item.precio,
    cantidad: item.cantidad,
  }))

const registrarPedidoActual = async () => {
  return estadoPedidos.crearPedido({
    cliente: datosUsuario.nombre,
    user_id: datosUsuario.id,
    total: estadoCarrito.totalPrecio,
    productos: obtenerProductosPedido(),
  })
}

const procesarPagoStripe = async () => {
  procesando.value = true
  errorPago.value = ''
  mensajePago.value = ''

  try {
    const respuesta = await fetch(buildApiUrl('/pagos/checkout-sesion'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        total: estadoCarrito.totalPrecio,
        productos: obtenerProductosPedido(),
        cliente: datosUsuario.nombre,
        user_id: datosUsuario.id,
      }),
    })
    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.error || 'No se pudo crear la sesión de pago')
    }

    if (datos.session_id && stripePublishableKey && window.Stripe) {
      const stripe = window.Stripe(stripePublishableKey)
      const resultadoStripe = await stripe.redirectToCheckout({ sessionId: datos.session_id })

      if (resultadoStripe.error) {
        throw new Error(resultadoStripe.error.message)
      }

      return
    }

    if (datos.checkout_url) {
      window.location.href = datos.checkout_url
      return
    }

    await registrarPedidoActual()
    mensajePago.value = datos.message || 'Pago simulado correctamente.'
    pagoExitoso.value = true
    estadoCarrito.vaciar()
  } catch (error) {
    console.error('Error al procesar el pedido:', error)
    errorPago.value = error.message || 'No se pudo registrar el pedido. Intenta nuevamente.'
  } finally {
    procesando.value = false
  }
}

const resetearModal = () => {
  errorPago.value = ''
  mensajePago.value = ''
  setTimeout(() => {
    pagoExitoso.value = false
  }, 500)
}

const aumentarCantidad = (item) => {
  estadoCarrito.actualizarCantidad(item.id, item.cantidad + 1)
}

const disminuirCantidad = (item) => {
  estadoCarrito.actualizarCantidad(item.id, item.cantidad - 1)
}

const abrirCarrito = () => {
  const panelCarrito = document.getElementById('carritoLateral')
  if (!panelCarrito || !window.bootstrap) return

  const instancia = window.bootstrap.Offcanvas.getOrCreateInstance(panelCarrito)
  instancia.show()
}

const manejarScroll = () => {
  mostrarCarritoFlotante.value = window.scrollY > 320 && estadoCarrito.totalArticulos > 0
}

watch(
  () => estadoCarrito.ultimaAccion,
  () => {
    productoToast.value = estadoCarrito.ultimoProductoAgregado || 'Producto'
    mostrarToastCarrito.value = true
    animarContador.value = true

    clearTimeout(timeoutToast)
    clearTimeout(timeoutContador)

    timeoutToast = window.setTimeout(() => {
      mostrarToastCarrito.value = false
    }, 2200)

    timeoutContador = window.setTimeout(() => {
      animarContador.value = false
    }, 550)

    manejarScroll()
  },
)

watch(
  () => estadoCarrito.totalArticulos,
  () => {
    manejarScroll()
  },
)

onMounted(() => {
  manejarScroll()
  window.addEventListener('scroll', manejarScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', manejarScroll)
  clearTimeout(timeoutToast)
  clearTimeout(timeoutContador)
})
</script>

<template>
  <nav
    :class="[
      'navbar navbar-expand-lg w-100 z-3',
      esInicio ? 'bg-transparent position-absolute' : 'fondo-elegante position-sticky top-0',
    ]"
    style="padding-top: 1.2rem; padding-bottom: 1.2rem"
  >
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center text-decoration-none" to="/">
        <img
          src="/logo.png"
          alt="Logo"
          width="40"
          height="40"
          class="me-3 rounded-circle bg-white p-1 opacity-75"
        />
        <span
          class="h5 mb-0 text-white"
          style="font-family: 'Times New Roman', serif; letter-spacing: 2px"
          >Sabor Azul</span
        >
      </router-link>

      <button
        class="navbar-toggler border-0 shadow-none"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#menuNavegacion"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="menuNavegacion">
        <ul
          class="navbar-nav ms-auto align-items-center gap-4"
          style="font-size: 0.85rem; letter-spacing: 2px; font-weight: 300"
        >
          <li class="nav-item">
            <a
              class="nav-link text-white d-flex align-items-center"
              :class="{ 'cart-bounce': animarContador }"
              href="#"
              data-bs-toggle="offcanvas"
              data-bs-target="#carritoLateral"
              style="cursor: pointer; opacity: 0.9"
            >
              <i class="bi bi-cart3 fs-5 me-1"></i>
              <span>({{ estadoCarrito.totalArticulos }})</span>
            </a>
          </li>

          <li class="nav-item">
            <router-link class="nav-link text-white text-uppercase" to="/">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white text-uppercase" to="/menu">Menú</router-link>
          </li>
          <li>
            <router-link class="nav-link text-white text-uppercase" to="/galeria"
              >Galería</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white text-uppercase" to="/contacto"
              >Contacto</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white text-uppercase" to="/reservas"
              >Reservas</router-link
            >
          </li>

          <li class="nav-item dropdown ms-lg-2">
            <a
              class="nav-link dropdown-toggle text-white text-uppercase"
              href="#"
              data-bs-toggle="dropdown"
              style="opacity: 0.8"
            >
              {{ datosUsuario.nombre }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-0 mt-3">
              <template v-if="datosUsuario.rol === 'admin'">
                <li>
                  <router-link class="dropdown-item text-primary fw-bold py-2" to="/admin"
                    ><i class="bi bi-gear-fill me-2"></i>Gestión de Menú</router-link
                  >
                </li>
                <li>
                  <router-link class="dropdown-item text-primary fw-bold py-2" to="/admin/pedidos"
                    ><i class="bi bi-list-check me-2"></i>Ver Pedidos</router-link
                  >
                </li>
                <li>
                  <router-link class="dropdown-item text-primary fw-bold py-2" to="/admin/reservas"
                    ><i class="bi bi-calendar-check me-2"></i>Gestión de Reservas</router-link
                  >
                </li>
                <li>
                  <router-link class="dropdown-item text-primary fw-bold py-2" to="/admin/contacto"
                    ><i class="bi bi-envelope-paper-fill me-2"></i>Mensajes de Contacto</router-link
                  >
                </li>
                <li>
                  <router-link class="dropdown-item text-primary fw-bold py-2" to="/admin/usuarios"
                    ><i class="bi bi-people-fill me-2"></i>Gestión de usuarios</router-link
                  >
                </li>
                <li><hr class="dropdown-divider" /></li>
              </template>

              <li>
                <router-link class="dropdown-item py-2" to="/perfil"
                  ><i class="bi bi-person me-2"></i>Mi Perfil</router-link
                >
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <router-link
                  class="dropdown-item text-danger py-2 fw-bold"
                  to="/login"
                  @click="datosUsuario.cerrarSesion()"
                >
                  <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="offcanvas offcanvas-end shadow-lg border-0" tabindex="-1" id="carritoLateral">
    <div class="offcanvas-header border-bottom">
      <h5
        class="offcanvas-title fw-bold"
        style="font-family: 'Times New Roman', serif; letter-spacing: 1px"
      >
        Tu Pedido
      </h5>
      <button type="button" class="btn-close shadow-none" data-bs-dismiss="offcanvas"></button>
    </div>

    <div class="offcanvas-body d-flex flex-column">
      <div v-if="estadoCarrito.items.length === 0" class="text-center text-muted my-auto">
        <i class="bi bi-basket fs-1 mb-3 d-block"></i>
        <p>Aún no has seleccionado ningún platillo.</p>
      </div>

      <div v-else class="flex-grow-1 overflow-auto">
        <div v-for="item in estadoCarrito.items" :key="item.id" class="mb-3 pb-3 border-bottom">
          <div class="d-flex align-items-center">
            <img
              :src="item.imagen"
              class="rounded me-3"
              style="width: 60px; height: 60px; object-fit: cover"
            />
            <div class="flex-grow-1">
              <h6 class="mb-1 fw-bold">{{ item.nombre }}</h6>
              <small class="text-muted d-block">${{ item.precio.toFixed(2) }} c/u</small>
              <small class="fw-semibold"
                >Subtotal: ${{ (item.precio * item.cantidad).toFixed(2) }}</small
              >
            </div>
            <button
              @click="estadoCarrito.eliminar(item.id)"
              class="btn btn-sm btn-outline-danger border-0"
              title="Eliminar producto"
            >
              <i class="bi bi-trash3 fs-5"></i>
            </button>
          </div>

          <div class="d-flex align-items-center justify-content-between mt-3">
            <div class="btn-group" role="group" aria-label="Editar cantidad">
              <button
                @click="disminuirCantidad(item)"
                class="btn btn-outline-dark btn-sm"
                title="Disminuir cantidad"
              >
                <i class="bi bi-dash-lg"></i>
              </button>
              <span class="btn btn-light btn-sm disabled px-3">{{ item.cantidad }}</span>
              <button
                @click="aumentarCantidad(item)"
                class="btn btn-outline-dark btn-sm"
                title="Aumentar cantidad"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>

            <small class="text-muted">{{ item.cantidad }} en tu carrito</small>
          </div>
        </div>
      </div>

      <div v-if="estadoCarrito.items.length > 0" class="pt-3 mt-auto border-top">
        <div class="d-flex justify-content-between mb-3">
          <span class="fw-bold">Total a pagar:</span>
          <span class="fw-bold fs-5">${{ estadoCarrito.totalPrecio.toFixed(2) }}</span>
        </div>
        <button
          class="btn btn-dark w-100 rounded-pill py-2 text-uppercase fw-bold"
          data-bs-toggle="modal"
          data-bs-target="#modalPago"
          data-bs-dismiss="offcanvas"
          style="letter-spacing: 1px"
        >
          Proceder al Pago
        </button>
      </div>
    </div>
  </div>

  <transition name="cart-toast">
    <div v-if="mostrarToastCarrito" class="toast-carrito shadow-lg">
      <div class="toast-carrito__icono">
        <i class="bi bi-cart-check-fill"></i>
      </div>
      <div class="toast-carrito__contenido">
        <strong>Agregado al carrito</strong>
        <span>{{ productoToast }}</span>
      </div>
    </div>
  </transition>

  <transition name="cart-fab">
    <button
      v-if="mostrarCarritoFlotante"
      class="btn carrito-flotante shadow-lg"
      type="button"
      @click="abrirCarrito"
    >
      <span class="carrito-flotante__icono">
        <i class="bi bi-bag-check-fill"></i>
      </span>
      <span class="text-start">
        <strong class="d-block">Tu carrito</strong>
        <small>{{ estadoCarrito.totalArticulos }} artículos</small>
      </span>
    </button>
  </transition>

  <div class="modal fade" id="modalPago" data-bs-backdrop="static" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
        <div v-if="!pagoExitoso" class="modal-body p-5">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-bold mb-0" style="color: #1a365d">Pasarela de pago</h4>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              :disabled="procesando"
              @click="resetearModal"
            ></button>
          </div>

          <p class="text-muted small mb-4">
            Total a cargar a tu tarjeta:
            <strong class="fs-5 text-dark">${{ estadoCarrito.totalPrecio.toFixed(2) }} MXN</strong>
          </p>

          <form @submit.prevent="procesarPagoStripe">
            <div v-if="errorPago" class="alert alert-danger py-2" role="alert">
              {{ errorPago }}
            </div>
            <div v-if="mensajePago" class="alert alert-info py-2" role="alert">
              {{ mensajePago }}
            </div>

            <div class="payment-provider mb-4">
              <div class="d-flex align-items-center gap-3">
                <i class="bi bi-credit-card-2-front-fill fs-2"></i>
                <div>
                  <h5 class="fw-bold mb-1">Stripe Checkout</h5>
                  <p class="text-muted small mb-0">
                    Paga en una pasarela segura con Stripe Checkout.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-dark w-100 py-3 rounded-pill fw-bold"
              :disabled="procesando"
            >
              <span v-if="!procesando">Pagar con Stripe</span>
              <span v-else>
                <span
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Preparando pago...
              </span>
            </button>
          </form>
        </div>

        <div v-else class="modal-body p-5 text-center">
          <i class="bi bi-check-circle-fill text-success mb-3 d-block" style="font-size: 4rem"></i>
          <h3 class="fw-bold mb-2">¡Pago Exitoso!</h3>
          <p class="text-muted mb-4">
            Tu orden ha sido procesada correctamente y el chef ya está preparándola.
          </p>
          <button
            type="button"
            class="btn btn-outline-dark rounded-pill px-5 py-2 fw-bold"
            data-bs-dismiss="modal"
            @click="resetearModal"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-bounce {
  animation: cartPulse 0.55s ease;
}

.toast-carrito {
  position: fixed;
  right: 1.25rem;
  bottom: 1.5rem;
  z-index: 1200;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 280px;
  max-width: 360px;
  padding: 0.95rem 1rem;
  border-radius: 1.1rem;
  background: rgba(15, 23, 42, 0.96);
  color: #fff;
  backdrop-filter: blur(8px);
}

.toast-carrito__icono {
  width: 46px;
  height: 46px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981, #34d399);
  font-size: 1.35rem;
  flex-shrink: 0;
}

.toast-carrito__contenido {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.toast-carrito__contenido span {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.92rem;
  margin-top: 0.15rem;
}

.carrito-flotante {
  position: fixed;
  right: 1.25rem;
  bottom: 5.75rem;
  z-index: 1100;
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  border: 0;
  border-radius: 999px;
  padding: 0.85rem 1rem;
  background: linear-gradient(135deg, #1a365d, #274c77);
  color: #fff;
}

.carrito-flotante:hover {
  background: linear-gradient(135deg, #274c77, #1a365d);
  color: #fff;
}

.carrito-flotante__icono {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.16);
  font-size: 1.15rem;
}

.cart-toast-enter-active,
.cart-toast-leave-active,
.cart-fab-enter-active,
.cart-fab-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.cart-toast-enter-from,
.cart-toast-leave-to,
.cart-fab-enter-from,
.cart-fab-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}

@keyframes cartPulse {
  0% {
    transform: scale(1);
  }
  45% {
    transform: scale(1.16);
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 576px) {
  .toast-carrito {
    right: 0.75rem;
    left: 0.75rem;
    bottom: 1rem;
    min-width: auto;
    max-width: none;
  }

  .carrito-flotante {
    right: 0.75rem;
    left: 0.75rem;
    bottom: 5.5rem;
    justify-content: center;
  }
}
</style>

<style scoped>
.navbar-toggler-icon {
  filter: invert(1);
}

.nav-link {
  transition: opacity 0.3s ease;
  opacity: 0.7;
}
.nav-link:hover,
.router-link-active {
  opacity: 1 !important;
}
.fondo-elegante {
  background-color: #0f172a;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.form-control:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 0.25rem rgba(15, 23, 42, 0.25);
}

.payment-provider {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1rem;
}

@media (max-width: 991.98px) {
  .navbar {
    padding-top: 0.75rem !important;
    padding-bottom: 0.75rem !important;
  }

  .navbar-collapse {
    margin-top: 0.9rem;
    padding: 1rem;
    border-radius: 0.75rem;
    background-color: rgba(15, 23, 42, 0.97);
    box-shadow: 0 1rem 2rem rgba(15, 23, 42, 0.22);
  }

  .navbar-nav {
    align-items: flex-start !important;
    gap: 0.65rem !important;
    letter-spacing: 1px !important;
  }

  .nav-link {
    width: 100%;
    padding: 0.55rem 0;
  }

  .dropdown-menu {
    width: 100%;
    border: 0;
    box-shadow: none !important;
  }
}

@media (max-width: 575.98px) {
  .navbar-brand span {
    font-size: 1rem;
  }

  .offcanvas {
    width: min(100vw, 380px) !important;
  }

  .modal-body {
    padding: 1.5rem !important;
  }

  .payment-provider {
    padding: 0.85rem;
  }
}
</style>
