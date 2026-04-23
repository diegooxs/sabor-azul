<template>
  <main class="container-fluid min-vh-100 bg-light" style="padding-top: 6rem; padding-bottom: 3rem">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold color-primary mb-0">Panel de Administración</h2>
          <p class="text-muted small">Administra el menú, pedidos, reservas y mensajes de clientes</p>
        </div>
        <div class="text-end">
          <span class="badge bg-dark py-2 px-3 shadow-sm"
            ><i class="bi bi-shield-lock me-2"></i>Modo Administrador</span
          >
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-6 col-lg-3">
          <router-link to="/admin/pedidos" class="admin-access-card">
            <i class="bi bi-list-check"></i>
            <span>Pedidos</span>
          </router-link>
        </div>
        <div class="col-6 col-lg-3">
          <router-link to="/admin/reservas" class="admin-access-card">
            <i class="bi bi-calendar-check"></i>
            <span>Reservas</span>
          </router-link>
        </div>
        <div class="col-6 col-lg-3">
          <router-link to="/admin/contacto" class="admin-access-card">
            <i class="bi bi-envelope-paper"></i>
            <span>Mensajes</span>
          </router-link>
        </div>
        <div class="col-6 col-lg-3">
          <router-link to="/admin/usuarios" class="admin-access-card">
            <i class="bi bi-people"></i>
            <span>Usuarios</span>
          </router-link>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-4">
          <div
            class="card border-0 shadow-lg rounded-4 overflow-hidden h-100"
            style="background-color: #0f172a"
          >
            <div class="card-body p-4 p-xl-5 text-white">
              <h5 class="fw-bold mb-4" style="letter-spacing: 1px">
                <i
                  :class="
                    modoEdicion
                      ? 'bi bi-pencil-square text-warning'
                      : 'bi bi-plus-circle text-primary'
                  "
                  class="me-2"
                ></i>
                {{ modoEdicion ? 'EDITAR PLATILLO' : 'NUEVO PLATILLO' }}
              </h5>

              <form @submit.prevent="guardarPlatillo">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-white-50 text-uppercase"
                    >Nombre</label
                  >
                  <input
                    type="text"
                    class="form-control bg-dark border-secondary text-white custom-input"
                    v-model="formulario.nombre"
                    required
                  />
                </div>

                <div class="row g-2 mb-3">
                  <div class="col-6">
                    <label class="form-label small fw-bold text-white-50 text-uppercase"
                      >Categoría</label
                    >
                    <select
                      class="form-select bg-dark border-secondary text-white custom-input"
                      v-model.number="formulario.categoria_id"
                      required
                    >
                      <option value="" disabled>Elegir...</option>
                      <option v-for="cat in estadoMenu.categorias" :key="cat.id" :value="cat.id">
                        {{ cat.nombre }}
                      </option>
                    </select>
                  </div>
                  <div class="col-6">
                    <label class="form-label small fw-bold text-white-50 text-uppercase"
                      >Precio ($)</label
                    >
                    <input
                      type="number"
                      class="form-control bg-dark border-secondary text-white custom-input"
                      v-model="formulario.precio"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label small fw-bold text-white-50 text-uppercase"
                    >URL de la Foto (Galería)</label
                  >
                  <input
                    type="url"
                    class="form-control bg-dark border-secondary text-white custom-input"
                    v-model="formulario.imagen"
                    placeholder="https://..."
                    required
                  />
                </div>

                <div class="mb-4">
                  <label class="form-label small fw-bold text-white-50 text-uppercase"
                    >Descripción</label
                  >
                  <textarea
                    class="form-control bg-dark border-secondary text-white custom-input"
                    rows="3"
                    v-model="formulario.descripcion"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  :class="modoEdicion ? 'btn-warning text-dark' : 'btn-primary'"
                  class="btn w-100 fw-bold py-2 rounded-3 text-uppercase mb-2"
                  style="letter-spacing: 1px"
                  :disabled="guardando"
                >
                  {{
                    guardando
                      ? 'Guardando...'
                      : modoEdicion
                        ? 'Guardar Cambios'
                        : 'Agregar a Galería'
                  }}
                </button>

                <button
                  v-if="modoEdicion"
                  type="button"
                  @click="cancelarEdicion"
                  class="btn btn-outline-secondary text-white w-100 py-2 rounded-3 text-uppercase"
                  style="letter-spacing: 1px"
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div class="card-header bg-white border-bottom p-4">
              <h5 class="fw-bold mb-0 color-primary">
                <i class="bi bi-images me-2"></i>Galería Activa ({{ estadoMenu.platillos.length }})
              </h5>
            </div>
            <div class="card-body p-0">
              <div v-if="estadoMenu.cargando" class="text-center py-5">
                <div class="spinner-border color-primary" role="status"></div>
                <p class="text-muted mb-0 mt-3">Cargando platillos...</p>
              </div>

              <div v-else-if="estadoMenu.error" class="text-center py-5 px-4">
                <i class="bi bi-exclamation-triangle fs-1 text-warning d-block mb-3"></i>
                <h5 class="fw-bold color-primary">No se pudo cargar el menú</h5>
                <p class="text-muted">{{ estadoMenu.error }}</p>
                <button class="btn btn-dark rounded-pill px-4" @click="estadoMenu.cargarPlatillos()">
                  Reintentar
                </button>
              </div>

              <div v-else class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                      <th class="ps-4 text-muted small text-uppercase">Foto y Detalles</th>
                      <th class="text-muted small text-uppercase">Categoría</th>
                      <th class="text-muted small text-uppercase">Precio</th>
                      <th class="text-center pe-4 text-muted small text-uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="platillo in estadoMenu.platillos" :key="platillo.id">
                      <td class="ps-4 py-3">
                        <div class="d-flex align-items-center">
                          <img
                            :src="platillo.imagen"
                            class="rounded shadow-sm object-fit-cover me-3"
                            style="width: 60px; height: 60px"
                          />
                          <div>
                            <h6 class="mb-0 fw-bold">{{ platillo.nombre }}</h6>
                            <small
                              class="text-muted text-truncate d-inline-block"
                              style="max-width: 200px"
                              >{{ platillo.descripcion }}</small
                            >
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="badge bg-light text-dark border">{{
                          platillo.categoria
                        }}</span>
                      </td>
                      <td class="fw-bold text-success">${{ platillo.precio.toFixed(2) }}</td>
                      <td class="text-center pe-4">
                        <button
                          @click="prepararEdicion(platillo)"
                          class="btn btn-sm btn-outline-secondary rounded-circle p-2 me-2"
                          title="Editar Platillo"
                        >
                          <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          @click="eliminarPlatillo(platillo.id)"
                          class="btn btn-sm btn-outline-danger rounded-circle p-2"
                          title="Eliminar Platillo"
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
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { estadoMenu } from '../store/menu'

// Variables
const modoEdicion = ref(false)
const idEditando = ref(null)
const guardando = ref(false)

const formulario = reactive({
  nombre: '',
  descripcion: '',
  precio: '',
  imagen: '',
  categoria_id: '',
})

const prepararEdicion = (platillo) => {
  modoEdicion.value = true
  idEditando.value = platillo.id

  formulario.nombre = platillo.nombre
  formulario.descripcion = platillo.descripcion
  formulario.precio = platillo.precio
  formulario.imagen = platillo.imagen
  // Usar categoria_id directamente si está disponible, sino buscar por nombre
  formulario.categoria_id = platillo.categoria_id || (estadoMenu.categorias.find(c => c.nombre === platillo.categoria)?.id || '')
}

const cancelarEdicion = () => {
  modoEdicion.value = false
  idEditando.value = null
  limpiarFormulario()
}

const guardarPlatillo = async () => {
  guardando.value = true

  try {
    if (modoEdicion.value) {
      await estadoMenu.editarPlatillo({ ...formulario, id: idEditando.value })
      cancelarEdicion()
    } else {
      await estadoMenu.agregarPlatillo({ ...formulario })
      limpiarFormulario()
    }
  } catch (error) {
    console.error('Error al guardar platillo:', error)
    alert(error.message)
  } finally {
    guardando.value = false
  }
}

const eliminarPlatillo = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este platillo?')) return

  try {
    await estadoMenu.eliminarPlatillo(id)
  } catch (error) {
    console.error('Error al eliminar platillo:', error)
    alert(error.message)
  }
}

const limpiarFormulario = () => {
  formulario.nombre = ''
  formulario.descripcion = ''
  formulario.precio = ''
  formulario.imagen = ''
  formulario.categoria_id = ''
}

onMounted(() => {
  estadoMenu.cargarCategorias()
  estadoMenu.cargarPlatillos()
})
</script>

<style scoped>
.color-primary {
  color: #1a365d;
}

.admin-access-card {
  min-height: 86px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  border: 1px solid #dbe3ef;
  border-radius: 0.75rem;
  background: #ffffff;
  color: #1a365d;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 0.25rem 0.75rem rgba(15, 23, 42, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.admin-access-card i {
  font-size: 1.45rem;
}

.admin-access-card:hover,
.admin-access-card.router-link-active {
  color: #0f172a;
  border-color: #1a365d;
  box-shadow: 0 0.65rem 1.2rem rgba(15, 23, 42, 0.12);
  transform: translateY(-2px);
}

.custom-input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>
