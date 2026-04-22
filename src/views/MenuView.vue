<template>
  <main class="container min-vh-100 pt-5 mt-5">
    <h1
      class="text-center fw-bold color-primary mb-5"
      style="font-family: 'Times New Roman', serif; letter-spacing: 2px"
    >
      Menú de Degustación
    </h1>

    <div class="row mb-5 justify-content-center">
      <div class="col-md-10 text-center">
        <div class="input-group mb-4 shadow-sm rounded-pill overflow-hidden border">
          <span class="input-group-text bg-white border-0 ps-4"
            ><i class="bi bi-search text-muted"></i
          ></span>
          <input
            type="text"
            v-model="busqueda"
            class="form-control form-control-lg border-0 shadow-none"
            placeholder="Buscar platillo o ingrediente..."
          />
        </div>

        <div class="d-flex flex-wrap justify-content-center gap-2">
          <button
            @click="categoriaSeleccionada = 'Todas'"
            :class="[
              'btn rounded-pill px-4 fw-bold',
              categoriaSeleccionada === 'Todas' ? 'btn-dark' : 'btn-outline-dark',
            ]"
          >
            Todas
          </button>
          <button
            @click="categoriaSeleccionada = 'Entradas'"
            :class="[
              'btn rounded-pill px-4 fw-bold',
              categoriaSeleccionada === 'Entradas' ? 'btn-dark' : 'btn-outline-dark',
            ]"
          >
            Entradas
          </button>
          <button
            @click="categoriaSeleccionada = 'Plato Fuerte'"
            :class="[
              'btn rounded-pill px-4 fw-bold',
              categoriaSeleccionada === 'Plato Fuerte' ? 'btn-dark' : 'btn-outline-dark',
            ]"
          >
            Platos Fuertes
          </button>
          <button
            @click="categoriaSeleccionada = 'Pastas'"
            :class="[
              'btn rounded-pill px-4 fw-bold',
              categoriaSeleccionada === 'Pastas' ? 'btn-dark' : 'btn-outline-dark',
            ]"
          >
            Pastas
          </button>
          <button
            @click="categoriaSeleccionada = 'Postres'"
            :class="[
              'btn rounded-pill px-4 fw-bold',
              categoriaSeleccionada === 'Postres' ? 'btn-dark' : 'btn-outline-dark',
            ]"
          >
            Postres
          </button>
          <button
            @click="categoriaSeleccionada = 'Bebidas'"
            :class="[
              'btn rounded-pill px-4 fw-bold',
              categoriaSeleccionada === 'Bebidas' ? 'btn-dark' : 'btn-outline-dark',
            ]"
          >
            Bebidas
          </button>
        </div>
      </div>
    </div>

    <div v-if="estadoMenu.cargando" class="text-center py-5 my-5">
      <div class="spinner-border color-primary" role="status"></div>
      <p class="text-muted mb-0 mt-3">Cargando menú...</p>
    </div>

    <div v-else-if="estadoMenu.error" class="text-center py-5 my-5">
      <i class="bi bi-exclamation-triangle fs-1 text-warning d-block mb-3"></i>
      <h4 class="fw-bold color-primary">No se pudo cargar el menú</h4>
      <p class="text-muted">{{ estadoMenu.error }}</p>
      <button class="btn btn-dark rounded-pill px-4 mt-2" @click="estadoMenu.cargarPlatillos()">
        Reintentar
      </button>
    </div>

    <div
      v-else
      class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 mb-5"
    >
      <div class="col" v-for="platillo in platillosFiltrados" :key="platillo.id">
        <div
          class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden tarjeta-animada bg-white"
        >
          <img
            :src="platillo.imagen"
            class="card-img-top object-fit-cover"
            style="height: 240px"
            :alt="platillo.nombre"
          />
          <div class="card-body p-4 d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title fw-bold color-primary mb-0">{{ platillo.nombre }}</h5>
              <span class="badge bg-light text-dark border">{{ platillo.categoria }}</span>
            </div>
            <p class="card-text text-muted small flex-grow-1">{{ platillo.descripcion }}</p>

            <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
              <span class="fs-5 fw-bold text-success">${{ platillo.precio.toFixed(2) }}</span>
              <button
                @click="agregarAlCarrito(platillo)"
                class="btn btn-dark rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center"
                style="width: 40px; height: 40px"
                title="Agregar al pedido"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!estadoMenu.cargando && !estadoMenu.error && platillosFiltrados.length === 0"
      class="text-center py-5 my-5"
    >
      <i class="bi bi-search fs-1 text-muted d-block mb-3 opacity-25"></i>
      <h4 class="text-muted fw-bold">No encontramos resultados</h4>
      <p class="text-muted-50">Intenta buscar con otra palabra o cambia la categoría.</p>
      <button @click="limpiarFiltros" class="btn btn-outline-dark rounded-pill px-4 mt-2">
        Ver todo el menú
      </button>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { estadoMenu } from '../store/menu'
import { estadoCarrito } from '../store/carrito'

const busqueda = ref('')
const categoriaSeleccionada = ref('Todas')

const agregarAlCarrito = (platillo) => {
  estadoCarrito.agregar(platillo)
}

const limpiarFiltros = () => {
  busqueda.value = ''
  categoriaSeleccionada.value = 'Todas'
}

const platillosFiltrados = computed(() => {
  return estadoMenu.platillos.filter((platillo) => {
    const coincideCategoria =
      categoriaSeleccionada.value === 'Todas' || platillo.categoria === categoriaSeleccionada.value

    const termino = busqueda.value.toLowerCase()
    const coincideTexto =
      platillo.nombre.toLowerCase().includes(termino) ||
      platillo.descripcion.toLowerCase().includes(termino)

    return coincideCategoria && coincideTexto
  })
})

onMounted(() => {
  estadoMenu.cargarPlatillos()
})
</script>

<style scoped>
.color-primary {
  color: #1a365d;
}

.tarjeta-animada {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.tarjeta-animada:hover {
  transform: translateY(-8px);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.15) !important;
}
</style>
