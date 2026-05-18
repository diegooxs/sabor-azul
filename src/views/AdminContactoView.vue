<template>
  <main class="container-fluid min-vh-100 bg-light" style="padding-top: 6rem; padding-bottom: 3rem">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 class="fw-bold color-primary mb-0">Mensajes de Contacto</h2>
          <p class="text-muted small mb-0">Consulta los mensajes enviados por los clientes</p>
        </div>
        <div class="text-end">
          <span class="badge bg-dark py-2 px-3 shadow-sm">
            <i class="bi bi-shield-lock me-2"></i>Modo Administrador
          </span>
          <button @click="cargarMensajes" class="btn btn-sm btn-outline-dark ms-2 rounded-pill">
            <i class="bi bi-arrow-clockwise me-1"></i>Actualizar
          </button>
        </div>
      </div>

      <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div class="card-header bg-white border-bottom p-4">
          <h5 class="fw-bold mb-0 color-primary">
            <i class="bi bi-envelope-paper me-2"></i>Mensajes Totales ({{
              estadoMensajesContacto.mensajes.length
            }})
          </h5>
        </div>

        <div class="card-body p-0">
          <div v-if="estadoMensajesContacto.cargando" class="text-center py-5">
            <div class="spinner-border color-primary" role="status"></div>
            <p class="text-muted mb-0 mt-3">Cargando mensajes...</p>
          </div>

          <div v-else-if="estadoMensajesContacto.error" class="text-center py-5 px-4">
            <i class="bi bi-exclamation-triangle fs-1 text-warning d-block mb-3"></i>
            <h5 class="fw-bold color-primary">Error al cargar mensajes</h5>
            <p class="text-muted">{{ estadoMensajesContacto.error }}</p>
            <button class="btn btn-dark rounded-pill px-4" @click="cargarMensajes">
              Reintentar
            </button>
          </div>

          <div v-else-if="estadoMensajesContacto.mensajes.length === 0" class="text-center py-5 px-4">
            <i class="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
            <h5 class="fw-bold text-muted">No hay mensajes</h5>
            <p class="text-muted mb-0">Los mensajes del formulario aparecerán aquí.</p>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4 text-muted small text-uppercase">Cliente</th>
                  <th class="text-muted small text-uppercase">Mensaje</th>
                  <th class="text-muted small text-uppercase">Fecha</th>
                  <th class="text-center pe-4 text-muted small text-uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mensaje in estadoMensajesContacto.mensajes" :key="mensaje.id">
                  <td class="ps-4 py-3">
                    <div class="fw-bold">{{ mensaje.nombre }}</div>
                    <a :href="`mailto:${mensaje.email}`" class="small text-muted text-decoration-none">
                      <i class="bi bi-envelope me-1"></i>{{ mensaje.email }}
                    </a>
                  </td>
                  <td class="py-3 mensaje-columna">{{ mensaje.mensaje }}</td>
                  <td class="text-muted small">{{ formatearFecha(mensaje.fecha) }}</td>
                  <td class="text-center pe-4">
                    <button
                      @click="eliminarMensaje(mensaje.id)"
                      class="btn btn-sm btn-outline-danger rounded-circle p-2"
                      title="Eliminar mensaje"
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
import { estadoMensajesContacto } from '../store/mensajesContacto'

const cargarMensajes = async () => {
  await estadoMensajesContacto.cargarMensajes()
}

const eliminarMensaje = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este mensaje?')) return

  try {
    await estadoMensajesContacto.eliminarMensaje(id)
  } catch (error) {
    console.error('Error al eliminar mensaje:', error)
    alert('Error al eliminar el mensaje')
  }
}

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'

  const fechaMensaje = new Date(String(fecha).replace(' ', 'T'))
  if (Number.isNaN(fechaMensaje.getTime())) {
    return fecha
  }

  return fechaMensaje.toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

onMounted(() => {
  cargarMensajes()
})
</script>

<style scoped>
.color-primary {
  color: #1a365d;
}

.mensaje-columna {
  max-width: 520px;
  white-space: pre-wrap;
}

@media (max-width: 767.98px) {
  main {
    padding-top: 4.5rem !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .card-header {
    padding: 1.25rem !important;
  }

  table {
    min-width: 760px;
  }

  .mensaje-columna {
    max-width: 360px;
  }
}
</style>
