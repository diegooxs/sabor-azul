<template>
  <main class="container min-vh-100 pt-5 mt-5">
    <div class="text-center mb-5 mt-4">
      <h2 class="display-5 elegante text-dark">Contáctanos</h2>
      <p class="lead text-muted">Estamos aquí para brindarte la mejor experiencia.</p>
    </div>

    <div class="row g-5 mb-5">
      <div class="col-md-6">
        <div class="card border-0 shadow-sm h-100 p-4 rounded-4">
          <div v-if="!mensajeEnviado" class="h-100 d-flex flex-column">
            <h4 class="fw-bold mb-4" style="font-family: 'Times New Roman', serif">
              Envíanos un mensaje
            </h4>

            <form @submit.prevent="enviarMensaje" class="flex-grow-1 d-flex flex-column">
              <div class="mb-3">
                <label for="nombre" class="form-label text-muted small fw-bold text-uppercase"
                  >Nombre completo</label
                >
                <input
                  type="text"
                  class="form-control rounded-2 p-2"
                  id="nombre"
                  v-model="formulario.nombre"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="email" class="form-label text-muted small fw-bold text-uppercase"
                  >Correo electrónico</label
                >
                <input
                  type="email"
                  class="form-control rounded-2 p-2"
                  id="email"
                  v-model="formulario.email"
                  required
                />
              </div>

              <div class="mb-4 flex-grow-1">
                <label for="mensaje" class="form-label text-muted small fw-bold text-uppercase"
                  >Mensaje</label
                >
                <textarea
                  class="form-control rounded-2 p-2 h-100"
                  id="mensaje"
                  rows="4"
                  v-model="formulario.mensaje"
                  style="min-height: 120px"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                class="btn btn-dark w-100 py-3 text-uppercase fw-bold rounded-pill mt-auto"
                style="letter-spacing: 1px"
                :disabled="enviando"
              >
                {{ enviando ? 'Enviando...' : 'Enviar Mensaje' }}
              </button>

              <p v-if="errorEnvio" class="text-danger small text-center mt-3 mb-0">
                {{ errorEnvio }}
              </p>
            </form>
          </div>

          <div
            v-else
            class="text-center py-5 text-animado d-flex flex-column justify-content-center h-100"
          >
            <i
              class="bi bi-envelope-check-fill text-success mb-3 d-block"
              style="font-size: 5rem"
            ></i>
            <h3 class="fw-bold mb-3" style="color: #1a365d">¡Mensaje Recibido!</h3>
            <p class="text-muted mb-4">
              Gracias por escribirnos, <strong class="text-dark">{{ formulario.nombre }}</strong
              >.<br /><br />
              Hemos recibido tus comentarios y te responderemos a
              <strong class="text-dark">{{ formulario.email }}</strong> lo más pronto posible.
            </p>
            <button
              @click="nuevoMensaje"
              class="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold mx-auto mt-3"
            >
              Enviar otro mensaje
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card border-0 shadow-sm h-100 rounded-4">
          <div class="card-body p-4 d-flex flex-column">
            <h4 class="fw-bold mb-4" style="font-family: 'Times New Roman', serif">
              Nuestra Ubicación
            </h4>

            <p class="text-muted mb-2">
              <i class="bi bi-geo-alt-fill me-2 text-dark fs-5"></i> Oaxaca de Juárez, Oaxaca.
            </p>
            <p class="text-muted mb-2">
              <i class="bi bi-telephone-fill me-2 text-dark fs-5"></i> +52 951 123 4567
            </p>
            <p class="text-muted mb-4">
              <i class="bi bi-envelope-fill me-2 text-dark fs-5"></i> reservas@saborazul.com
            </p>

            <div
              class="flex-grow-1 w-100 mt-2 rounded-3 overflow-hidden shadow-sm"
              style="min-height: 250px"
            >
              <iframe
                src="https://maps.google.com/maps?q=Oaxaca%20de%20Juarez&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style="border: 0"
                allowfullscreen=""
                loading="lazy"
              >
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { estadoMensajesContacto } from '../store/mensajesContacto'

const mensajeEnviado = ref(false)
const enviando = ref(false)
const errorEnvio = ref('')

const formulario = reactive({
  nombre: '',
  email: '',
  mensaje: '',
})

const enviarMensaje = async () => {
  enviando.value = true
  errorEnvio.value = ''

  try {
    await estadoMensajesContacto.crearMensaje({ ...formulario })
    mensajeEnviado.value = true
  } catch (error) {
    errorEnvio.value = error.message || 'No se pudo enviar el mensaje'
  } finally {
    enviando.value = false
  }
}

const nuevoMensaje = () => {
  mensajeEnviado.value = false
  errorEnvio.value = ''
  formulario.nombre = ''
  formulario.email = ''
  formulario.mensaje = ''
}
</script>

<style scoped>
.elegante {
  font-family: 'Times New Roman', serif;
  font-style: italic;
  letter-spacing: 2px;
}

.form-control:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 0.25rem rgba(15, 23, 42, 0.25);
}

/* Animación suave para cuando aparece el mensaje de éxito */
.text-animado {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
