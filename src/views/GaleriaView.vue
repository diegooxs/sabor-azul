<template>
  <main class="galeria-page min-vh-100 p-0">
    <header
      class="galeria-header text-white mb-5 border-bottom border-secondary"
      style="background-color: #0f172a !important; padding-top: 110px; padding-bottom: 50px"
    >
      <div class="container text-center">
        <div class="d-flex justify-content-center align-items-center flex-column flex-sm-row">
          <img
            src="/src/assets/logo.png"
            alt="Logo Sabor Azul"
            class="me-sm-4 mb-3 mb-sm-0 bg-white rounded-circle p-2 shadow"
            style="height: 75px; width: 75px; object-fit: contain"
          />

          <h1
            class="fw-bold mb-0 elegante display-4"
            style="font-family: 'Times New Roman', serif; letter-spacing: 2px"
          >
            Galería
          </h1>
        </div>
      </div>
    </header>

    <div class="container pb-5">
      <div class="row mb-5 justify-content-center">
        <div class="col-md-10 text-center">
          <div class="d-flex flex-wrap justify-content-center gap-4 filter-container">
            <span
              v-for="categoria in categorias"
              :key="categoria"
              @click="filtroSeleccionado = categoria"
              :class="['filter-item', filtroSeleccionado === categoria ? 'active' : '']"
            >
              {{ categoria }}
            </span>
          </div>
        </div>
      </div>

      <transition-group
        name="gallery-list"
        tag="div"
        class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-5"
      >
        <div
          v-for="imagen in imagenesFiltradas"
          :key="imagen.id"
          class="col gallery-item"
          @click="abrirLightbox(imagen)"
        >
          <div
            class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden tarjeta-galeria bg-white"
          >
            <img :src="imagen.src" class="card-img-top object-fit-cover" :alt="imagen.alt" />
          </div>
        </div>
      </transition-group>

      <transition name="modal-fade">
        <div v-if="modalAbierto" class="lightbox-modal" @click="cerrarLightbox">
          <div class="lightbox-content" @click.stop>
            <img
              :src="imagenSeleccionada.src"
              :alt="imagenSeleccionada.alt"
              class="img-fluid lightbox-img"
            />
            <p class="lightbox-caption fw-bold mt-2 text-dark">{{ imagenSeleccionada.alt }}</p>
            <button
              class="btn-close lightbox-close"
              @click="cerrarLightbox"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </transition>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

const categorias = ['TODAS', 'INSTALACIONES', 'PLATILLOS', 'EVENTOS']

const imagenes = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
    category: 'INSTALACIONES',
    alt: 'Interior del restaurante',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500',
    category: 'PLATILLOS',
    alt: 'Un plato de carne asada',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1595955809761-dcd4c857e147?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'PLATILLOS',
    alt: 'Panque de zarzamora',
  },
  {
    id: 4,
    src: 'https://plus.unsplash.com/premium_photo-1712736395898-02844eeb1968?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVycmF6YSUyMHJlc3RhdXJuYXRlfGVufDB8fDB8fHww',
    category: 'INSTALACIONES',
    alt: 'Terraza del restaurante',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=500',
    category: 'EVENTOS',
    alt: 'Celebración en terraza',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1676300184847-4ee4030409c0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'PLATILLOS',
    alt: 'Pasta de tomate con albahaca',
  },
  {
    id: 7,
    src: 'https://media.istockphoto.com/id/2215934552/es/foto/camarero-haciendo-un-pedido-en-el-ordenador-mientras-trabaja-en-un-bar.webp?a=1&b=1&s=612x612&w=0&k=20&c=CI16m6o-v0Bz6ok0mLSGaLOzBCmrcze9M79FToSrM18=',
    category: 'INSTALACIONES',
    alt: 'Barra del restaurante',
  },
  {
    id: 8,
    src: 'https://plus.unsplash.com/premium_photo-1668623924418-5549b0bf01ca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGV2ZW50b3MlMjByZXN0YXVyYW50fGVufDB8fDB8fHww',
    category: 'EVENTOS',
    alt: 'Fiesta nocturna de graduación',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJlc3RhdXJhbnRlc3xlbnwwfHwwfHx8MA%3D%3D',
    category: 'INSTALACIONES',
    alt: 'Vista panorámica del restaurante',
  },
  {
    id: 10,
    src: 'https://media.istockphoto.com/id/1296908264/es/foto/camar%C3%B3n-tempura.webp?a=1&b=1&s=612x612&w=0&k=20&c=wzvgD_tdkX-SzGD41qrJqrDCORz2u-VT4PxYM49ZbGg=',
    category: 'PLATILLOS',
    alt: 'Gambas doradas con ajo',
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmlzdGVjfGVufDB8fDB8fHww',
    category: 'PLATILLOS',
    alt: 'Ribeye a la parrilla con guarnición',
  },
  {
    id: 12,
    src: 'https://plus.unsplash.com/premium_photo-1661419883163-bb4df1c10109?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'PLATILLOS',
    alt: 'pollo al curry con arroz basmati',
  },
  {
    id: 13,
    src: 'https://plus.unsplash.com/premium_photo-1677220808756-0e66328115c8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZXZlbnRvcyUyMHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
    category: 'EVENTOS',

    alt: 'Preparación de evento privado',
  },
  {
    id: 14,

    category: 'EVENTOS',
    src: 'https://images.unsplash.com/photo-1732557377011-b822ddc13649?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZXZlbnRvcyUyMHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
    alt: 'Cena romántica en Sabor Azul',
  },
]

const filtroSeleccionado = ref('TODAS')

const imagenesFiltradas = computed(() => {
  if (filtroSeleccionado.value === 'TODAS') {
    return imagenes
  }
  return imagenes.filter((img) => img.category === filtroSeleccionado.value)
})

const modalAbierto = ref(false)
const imagenSeleccionada = ref(null)

const abrirLightbox = (imagen) => {
  imagenSeleccionada.value = imagen
  modalAbierto.value = true
}
const cerrarLightbox = () => {
  modalAbierto.value = false
  imagenSeleccionada.value = null
}
</script>

<style scoped>
.elegante {
  font-family: 'Times New Roman', serif;
  font-style: italic;
  letter-spacing: 2px;
}

.tarjeta-galeria {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
}
.tarjeta-galeria:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.15) !important;
}
.card-img-top {
  height: 240px;
}

.filter-item {
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  color: #666;
  padding-bottom: 5px;
  transition: color 0.3s ease;
  font-size: 0.9rem;
}
.filter-item:hover {
  color: #000;
}
.filter-item.active {
  color: #000;
  border-bottom: 2px solid #000;
}

.gallery-list-enter-active,
.gallery-list-leave-active {
  transition: all 0.5s ease;
}
.gallery-list-enter-from,
.gallery-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.gallery-list-move {
  transition: transform 0.5s ease;
}

.lightbox-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  text-align: center;
  background-color: white;
  padding: 10px;
  border-radius: 12px;
}
.lightbox-img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}
.lightbox-close {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 2001;
  background-color: white;
  border-radius: 50%;
  padding: 8px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

@media (max-width: 767.98px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .elegante {
    letter-spacing: 1px;
  }

  .filter-container {
    gap: 1rem !important;
  }

  .filter-item {
    font-size: 0.82rem;
  }

  .card-img-top {
    height: 210px;
  }

  .lightbox-content {
    max-width: calc(100% - 2rem);
    padding: 0.5rem;
  }

  .lightbox-img {
    max-height: 72vh;
  }
}
</style>
