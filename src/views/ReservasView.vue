<template>
  <main class="container min-vh-100 pt-5 mt-5">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-xl-6">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div
            class="bg-dark text-white text-center p-4"
            style="background-color: #0f172a !important"
          >
            <h3
              class="fw-bold mb-0"
              style="font-family: 'Times New Roman', serif; letter-spacing: 2px"
            >
              Reservar Mesa
            </h3>
          </div>

          <div class="card-body p-4 p-md-5">
            <div v-if="!reservaExitosa">
              <p class="text-center text-muted mb-4">
                Asegura tu lugar en Sabor Azul. Por favor, llena los detalles a continuación.
              </p>

              <form @submit.prevent="procesarReserva">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-muted text-uppercase"
                    >Nombre Completo</label
                  >
                  <input
                    type="text"
                    class="form-control p-2"
                    v-model="formulario.nombre"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label small fw-bold text-muted text-uppercase"
                    >Correo Electrónico</label
                  >
                  <input
                    type="email"
                    class="form-control p-2"
                    v-model="formulario.email"
                    required
                  />
                </div>

                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-muted text-uppercase">Fecha</label>
                    <input
                      type="date"
                      class="form-control p-2"
                      v-model="formulario.fecha"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-muted text-uppercase">Hora</label>
                    <input
                      type="time"
                      class="form-control p-2"
                      v-model="formulario.hora"
                      required
                    />
                  </div>
                  <div class="col-12">
                    <label class="form-label small fw-bold text-muted text-uppercase"
                      >Número de Personas</label
                    >
                    <select class="form-select p-2" v-model="formulario.personas" required>
                      <option value="1">1 Persona</option>
                      <option value="2" selected>2 Personas</option>
                      <option value="3">3 Personas</option>
                      <option value="4">4 Personas</option>
                      <option value="5">5+ Personas</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-dark w-100 py-3 rounded-pill fw-bold text-uppercase"
                  style="letter-spacing: 1px"
                >
                  Confirmar Reserva
                </button>
              </form>
            </div>

            <div v-else class="text-center py-4 text-animado">
              <i
                class="bi bi-check-circle-fill text-success mb-3 d-block"
                style="font-size: 5rem"
              ></i>
              <h3 class="fw-bold color-primary mb-3">¡Solicitud Enviada!</h3>
              <p class="text-muted mb-4">
                Gracias, <strong class="text-dark">{{ formulario.nombre.toUpperCase() }}</strong
                >.<br /><br />
                Hemos recibido tu información y te contactaremos pronto al correo
                <strong class="text-dark">{{ formulario.email }}</strong> para confirmar tu mesa.
              </p>
              <button
                @click="nuevaReserva"
                class="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold"
              >
                Hacer otra reserva
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue'

const reservaExitosa = ref(false)

const formulario = reactive({
  nombre: '',
  email: '',
  fecha: '',
  hora: '',
  personas: '2',
})

const procesarReserva = () => {
  reservaExitosa.value = true
}

const nuevaReserva = () => {
  reservaExitosa.value = false
  formulario.nombre = ''
  formulario.email = ''
  formulario.fecha = ''
  formulario.hora = ''
  formulario.personas = '2'
}
</script>

<style scoped>
.color-primary {
  color: #1a365d;
}
.form-control:focus,
.form-select:focus {
  border-color: #1a365d;
  box-shadow: 0 0 0 0.25rem rgba(26, 54, 93, 0.1);
}
.text-animado {
  animation: fadeIn 0.6s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
