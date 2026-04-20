<script setup>
import { computed } from 'vue'
import { estadoPedidos } from '../store/pedidos'

const totalPedidos = computed(() => estadoPedidos.items.length)
const ventasTotales = computed(() =>
  estadoPedidos.items.reduce((total, pedido) => total + Number(pedido.total || 0), 0),
)

const pedidosPendientes = computed(
  () => estadoPedidos.items.filter((pedido) => pedido.estado === 'Pendiente').length,
)

const formatearFecha = (fecha) =>
  new Date(fecha).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

const clasesEstado = {
  Pendiente: 'bg-warning-subtle text-warning-emphasis',
  Preparando: 'bg-info-subtle text-info-emphasis',
  Entregado: 'bg-success-subtle text-success-emphasis',
  Cancelado: 'bg-danger-subtle text-danger-emphasis',
}
</script>

<template>
  <main class="container-fluid min-vh-100 bg-light" style="padding-top: 6rem; padding-bottom: 3rem">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 class="fw-bold color-primary mb-1">Pedidos Recibidos</h2>
          <p class="text-muted mb-0">Consulta y administra las órdenes confirmadas desde el carrito.</p>
        </div>
        <span class="badge bg-dark py-2 px-3 shadow-sm">
          <i class="bi bi-receipt-cutoff me-2"></i>{{ totalPedidos }} pedidos registrados
        </span>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body p-4">
              <small class="text-uppercase text-muted fw-bold d-block mb-2">Pedidos</small>
              <h3 class="fw-bold mb-0 color-primary">{{ totalPedidos }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body p-4">
              <small class="text-uppercase text-muted fw-bold d-block mb-2">Pendientes</small>
              <h3 class="fw-bold mb-0 text-warning-emphasis">{{ pedidosPendientes }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body p-4">
              <small class="text-uppercase text-muted fw-bold d-block mb-2">Ventas acumuladas</small>
              <h3 class="fw-bold mb-0 text-success">${{ ventasTotales.toFixed(2) }}</h3>
            </div>
          </div>
        </div>
      </div>

      <div v-if="estadoPedidos.items.length === 0" class="card border-0 shadow-sm rounded-4">
        <div class="card-body text-center py-5">
          <i class="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
          <h4 class="fw-bold color-primary">Todavía no hay pedidos</h4>
          <p class="text-muted mb-0">
            Cuando un cliente confirme una compra, aparecerá aquí automáticamente.
          </p>
        </div>
      </div>

      <div v-else class="row g-4">
        <div v-for="pedido in estadoPedidos.items" :key="pedido.id" class="col-12">
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                <div>
                  <div class="d-flex align-items-center flex-wrap gap-2 mb-2">
                    <h5 class="fw-bold mb-0 color-primary">{{ pedido.id }}</h5>
                    <span class="badge rounded-pill" :class="clasesEstado[pedido.estado] || 'bg-secondary'">
                      {{ pedido.estado }}
                    </span>
                  </div>
                  <p class="mb-1"><strong>Cliente:</strong> {{ pedido.cliente }}</p>
                  <p class="text-muted mb-0">{{ formatearFecha(pedido.fecha) }}</p>
                </div>

                <div class="d-flex align-items-center flex-wrap gap-2">
                  <select
                    class="form-select"
                    style="min-width: 180px"
                    :value="pedido.estado"
                    @change="estadoPedidos.actualizarEstado(pedido.id, $event.target.value)"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Preparando">Preparando</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                  <button
                    class="btn btn-outline-danger"
                    @click="estadoPedidos.eliminarPedido(pedido.id)"
                  >
                    <i class="bi bi-trash3 me-2"></i>Eliminar
                  </button>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Producto</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-end">Precio</th>
                      <th class="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="producto in pedido.productos" :key="`${pedido.id}-${producto.id}`">
                      <td class="fw-semibold">{{ producto.nombre }}</td>
                      <td class="text-center">{{ producto.cantidad }}</td>
                      <td class="text-end">${{ Number(producto.precio).toFixed(2) }}</td>
                      <td class="text-end">${{ (Number(producto.precio) * producto.cantidad).toFixed(2) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="d-flex justify-content-end mt-3">
                <div class="text-end">
                  <small class="text-muted d-block">Total del pedido</small>
                  <span class="fw-bold fs-5">${{ Number(pedido.total).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.color-primary {
  color: #1a365d;
}
</style>
