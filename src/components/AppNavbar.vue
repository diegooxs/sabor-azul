<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { estadoCarrito } from '../store/carrito'
import { estadoPedidos } from '../store/pedidos'
import { datosUsuario } from '../store/usuario'

const route = useRoute()
const esInicio = computed(() => route.path === '/')

const procesando = ref(false)
const pagoExitoso = ref(false)

const procesarPagoMock = () => {
  procesando.value = true

  setTimeout(() => {
    estadoPedidos.crearPedido({
      cliente: datosUsuario.nombre,
      total: estadoCarrito.totalPrecio,
      productos: estadoCarrito.items.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
      })),
    })

    procesando.value = false
    pagoExitoso.value = true
    estadoCarrito.vaciar()
  }, 2500)
}

const resetearModal = () => {
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
                  <router-link class="dropdown-item" to="/admin/usuarios">
                    <i class="bi bi-people-fill"></i> Gestión de Usuarios Express
                  </router-link>
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
        <div
          v-for="item in estadoCarrito.items"
          :key="item.id"
          class="mb-3 pb-3 border-bottom"
        >
          <div class="d-flex align-items-center">
            <img
              :src="item.imagen"
              class="rounded me-3"
              style="width: 60px; height: 60px; object-fit: cover"
            />
            <div class="flex-grow-1">
              <h6 class="mb-1 fw-bold">{{ item.nombre }}</h6>
              <small class="text-muted d-block">${{ item.precio.toFixed(2) }} c/u</small>
              <small class="fw-semibold">Subtotal: ${{ (item.precio * item.cantidad).toFixed(2) }}</small>
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

          <form @submit.prevent="procesarPagoMock">
            <div class="mb-3">
              <label class="form-label small text-muted fw-bold text-uppercase"
                >Número de Tarjeta
              </label>
              <input
                type="text"
                class="form-control p-2"
                placeholder="0000 0000 0000 0000"
                maxlength="19"
                required
                :disabled="procesando"
              />
            </div>

            <div class="row g-3 mb-4">
              <div class="col-6">
                <label class="form-label small text-muted fw-bold text-uppercase"
                  >Vencimiento</label
                >
                <input
                  type="text"
                  class="form-control p-2"
                  placeholder="MM/YY"
                  maxlength="5"
                  required
                  :disabled="procesando"
                />
              </div>
              <div class="col-6">
                <label class="form-label small text-muted fw-bold text-uppercase">CVV</label>
                <input
                  type="password"
                  class="form-control p-2"
                  placeholder="123"
                  maxlength="3"
                  required
                  :disabled="procesando"
                />
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-dark w-100 py-3 rounded-pill fw-bold"
              :disabled="procesando"
            >
              <span v-if="!procesando">Pagar Ahora</span>
              <span v-else>
                <span
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Procesando conexión...
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
</style>
