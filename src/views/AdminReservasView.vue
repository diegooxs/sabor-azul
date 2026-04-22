<template>
  <main class="container-fluid min-vh-100 bg-light" style="padding-top: 6rem; padding-bottom: 3rem">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold color-primary mb-0">Gestión de Reservas</h2>
          <p class="text-muted small">Administra todas las reservas de mesas</p>
        </div>
        <div class="text-end">
          <span class="badge bg-dark py-2 px-3 shadow-sm"
            ><i class="bi bi-shield-lock me-2"></i>Modo Administrador</span
          >
          <button @click="cargarReservas" class="btn btn-sm btn-outline-dark ms-2 rounded-pill">
            <i class="bi bi-arrow-clockwise me-1"></i>Actualizar
          </button>
        </div>
      </div>

      <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div class="card-header bg-white border-bottom p-4">
          <h5 class="fw-bold mb-0 color-primary">
            <i class="bi bi-calendar-check me-2"></i>Reservas Totales ({{ estadoReservas.reservas.length }})
          </h5>
        </div>

        <div class="card-body p-0">
          <div v-if="estadoReservas.cargando" class="text-center py-5">
            <div class="spinner-border color-primary" role="status"></div>
            <p class="text-muted mb-0 mt-3">Cargando reservas...</p>
          </div>

          <div v-else-if="estadoReservas.error" class="text-center py-5 px-4">
            <i class="bi bi-exclamation-triangle fs-1 text-warning d-block mb-3"></i>
            <h5 class="fw-bold color-primary">Error al cargar reservas</h5>
            <p class="text-muted">{{ estadoReservas.error }}</p>
            <button class="btn btn-dark rounded-pill px-4" @click="cargarReservas">
              Reintentar
            </button>
          </div>

          <div v-else-if="estadoReservas.reservas.length === 0" class="text-center py-5 px-4">
            <i class="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
            <h5 class="fw-bold text-muted">No hay reservas</h5>
            <p class="text-muted">No hay registros de reservas en este momento</p>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4 text-muted small text-uppercase">Cliente</th>
                  <th class="text-muted small text-uppercase">Contacto</th>
                  <th class="text-muted small text-uppercase">Fecha y Hora</th>
                  <th class="text-muted small text-uppercase">Personas</th>
                  <th class="text-center text-muted small text-uppercase">Estado</th>
                  <th class="text-center pe-4 text-muted small text-uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="reserva in estadoReservas.reservas" :key="reserva.id">
                  <td class="ps-4 py-3 fw-bold">{{ reserva.nombre }}</td>
                  <td>
                    <div class="small">
                      <div>
                        <i class="bi bi-envelope me-1"></i>
                        {{ reserva.email }}
                      </div>
                      <div v-if="reserva.telefono" class="text-muted">
                        <i class="bi bi-telephone me-1"></i>
                        {{ reserva.telefono }}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="small">
                      <div><i class="bi bi-calendar me-1"></i>{{ formatearFecha(reserva.fecha) }}</div>
                      <div class="text-muted"><i class="bi bi-clock me-1"></i>{{ reserva.hora }}</div>
                    </div>
                  </td>
                  <td class="text-center fw-bold">{{ reserva.personas }}</td>
                  <td class="text-center">
                    <select
                      :value="reserva.estado"
                      @change="actualizarEstado(reserva.id, $event.target.value)"
                      :class="[
                        'status-select',
                        {
                          'status-pending': reserva.estado === 'pendiente',
                          'status-confirmed': reserva.estado === 'confirmada',
                          'status-canceled': reserva.estado === 'cancelada',
                        },
                      ]"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </td>
                  <td class="text-center pe-4">
                    <button
                      @click="eliminarReserva(reserva.id)"
                      class="btn btn-sm btn-outline-danger rounded-circle p-2"
                      title="Eliminar Reserva"
                    >
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { estadoReservas } from '../store/reservas'

const cargarReservas = async () => {
  await estadoReservas.cargarReservas()
}

const actualizarEstado = async (id, nuevoEstado) => {
  try {
    await estadoReservas.actualizarEstado(id, nuevoEstado)
  } catch (error) {
    console.error('Error al actualizar estado:', error)
    alert('Error al actualizar la reserva')
    await cargarReservas()
  }
}

const eliminarReserva = async (id) => {
  if (!confirm('¿Estás seguro de eliminar esta reserva?')) return

  try {
    await estadoReservas.eliminarReserva(id)
  } catch (error) {
    console.error('Error al eliminar:', error)
    alert('Error al eliminar la reserva')
  }
}

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'

  const fechaNormalizada = typeof fecha === 'string' && fecha.includes('T') ? fecha.split('T')[0] : fecha
  const [year, month, day] = String(fechaNormalizada).split('-').map(Number)
  const fechaReserva =
    year && month && day ? new Date(year, month - 1, day) : new Date(fechaNormalizada)

  if (Number.isNaN(fechaReserva.getTime())) {
    return 'Fecha no valida'
  }

  return fechaReserva.toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

onMounted(() => {
  cargarReservas()
})
</script>

<style scoped>
.color-primary {
  color: #1a365d;
}

table select:focus {
  outline: none;
  box-shadow: 0 0 0 0.25rem rgba(26, 54, 93, 0.25);
}

.status-select {
  min-width: 130px;
  cursor: pointer;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  padding: 0.45rem 2rem 0.45rem 0.85rem;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: #ffffff;
  color: #1f2937;
}

.status-select option {
  background-color: #ffffff;
  color: #1f2937;
}

.status-pending {
  background-color: #eef2f7;
  border-color: #94a3b8;
  color: #1e293b;
}

.status-confirmed {
  background-color: #ecfdf5;
  border-color: #86efac;
  color: #166534;
}

.status-canceled {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
  color: #475569;
}
</style>
