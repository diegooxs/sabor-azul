<template>
  <main class="container min-vh-100 pt-5 mt-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div class="row g-0">
            <div
              class="col-md-4 bg-dark text-white text-center p-5 d-flex flex-column align-items-center justify-content-center"
              style="background-color: #0f172a !important"
            >
              <img :src="datosUsuario.foto" class="rounded-circle img-thumbnail mb-3" width="120" />
              <h4 class="fw-bold mb-1">{{ datosUsuario.nombre }}</h4>
              <p class="text-white-50 small">Miembro desde 2026</p>
            </div>

            <div class="col-md-8 p-5">
              <h3 class="fw-bold mb-4 color-primary">Configuración de Perfil</h3>

              <form @submit.prevent="guardarCambios">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-muted text-uppercase">Nombre</label>
                    <input type="text" class="form-control" v-model="edicion.nombre" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-muted text-uppercase"
                      >Apellidos</label
                    >
                    <input type="text" class="form-control" v-model="edicion.apellido" />
                  </div>
                  <div class="col-12">
                    <label class="form-label small fw-bold text-muted text-uppercase"
                      >Correo Electrónico</label
                    >
                    <input type="email" class="form-control" v-model="edicion.email" />
                  </div>
                  <div class="col-12">
                    <label class="form-label small fw-bold text-muted text-uppercase"
                      >Teléfono</label
                    >
                    <input type="tel" class="form-control" v-model="edicion.telefono" />
                  </div>
                </div>

                <div class="mt-5 d-flex gap-3">
                  <button type="submit" class="btn btn-dark px-4 rounded-pill fw-bold">
                    Guardar Cambios
                  </button>
                  <router-link to="/" class="btn btn-outline-secondary px-4 rounded-pill"
                    >Cancelar</router-link
                  >
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive } from 'vue'
import { datosUsuario } from '../store/usuario'

const edicion = reactive({
  nombre: datosUsuario.nombre,
  apellido: datosUsuario.apellido,
  email: datosUsuario.email,
  telefono: datosUsuario.telefono,
})

const guardarCambios = () => {
  datosUsuario.actualizarPerfil(edicion)
  alert('¡Perfil actualizado con éxito, Santiago!')
}
</script>

<style scoped>
.color-primary {
  color: #1a365d;
}
.form-control:focus {
  border-color: #1a365d;
  box-shadow: 0 0 0 0.25rem rgba(26, 54, 93, 0.1);
}

@media (max-width: 767.98px) {
  main {
    padding-top: 4.5rem !important;
  }

  .col-md-4,
  .col-md-8 {
    padding: 1.5rem !important;
  }

  .mt-5.d-flex {
    flex-direction: column;
    margin-top: 2rem !important;
  }

  .mt-5.d-flex .btn {
    width: 100%;
  }
}
</style>
