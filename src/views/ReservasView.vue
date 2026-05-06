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
            <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
              {{ error }}
              <button type="button" class="btn-close" @click="error = ''"></button>
            </div>

            <div v-if="!reservaExitosa">
              <p class="text-center text-muted mb-4">
                Asegura tu lugar en Sabor Azul. Por favor, llena los detalles a continuación.
              </p>
              <div v-if="usuarioGoogle" class="alert alert-info py-2 small" role="alert">
                Enviaremos la confirmación de tu reserva a tu correo de Google:
                <strong>{{ datosUsuario.email }}</strong>
              </div>

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

                <div class="mb-3">
                  <label class="form-label small fw-bold text-muted text-uppercase"
                    >Teléfono</label
                  >
                  <input
                    type="tel"
                    class="form-control p-2"
                    v-model="formulario.telefono"
                    placeholder="+1 (555) 000-0000"
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
                  :disabled="cargando"
                >
                  {{ cargando ? 'Procesando...' : 'Confirmar Reserva' }}
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
                <span v-if="correoConfirmacionEnviado">
                  También enviamos un correo con los detalles de tu reservación.
                </span>
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
import { computed, onMounted, reactive, ref } from 'vue'
import { estadoReservas } from '../store/reservas'
import { datosUsuario } from '../store/usuario'

const reservaExitosa = ref(false)
const cargando = ref(false)
const error = ref('')
const correoConfirmacionEnviado = ref(false)
const usuarioGoogle = computed(() => datosUsuario.proveedor === 'google' && datosUsuario.email)

const formulario = reactive({
  nombre: '',
  email: '',
  telefono: '',
  fecha: '',
  hora: '',
  personas: '2',
})

const llenarDatosUsuarioGoogle = () => {
  if (!usuarioGoogle.value) return

  formulario.nombre = datosUsuario.nombre || formulario.nombre
  formulario.email = datosUsuario.email || formulario.email
  formulario.telefono = datosUsuario.telefono || formulario.telefono
}

const procesarReserva = async () => {
  if (!formulario.nombre || !formulario.email || !formulario.fecha || !formulario.hora) {
    error.value = 'Por favor completa todos los campos'
    return
  }

  cargando.value = true
  error.value = ''

  try {
    const reservaCreada = await estadoReservas.crearReserva({
      nombre: formulario.nombre.trim(),
      email: formulario.email.trim(),
      telefono: formulario.telefono.trim(),
      fecha: formulario.fecha,
      hora: formulario.hora,
      personas: formulario.personas,
      enviarConfirmacionEmail: usuarioGoogle.value,
    })

    correoConfirmacionEnviado.value = Boolean(reservaCreada?.correoConfirmacion?.enviado)
    reservaExitosa.value = true
  } catch (err) {
    error.value = err.message || 'Error al procesar la reserva'
    console.error('Error:', err)
  } finally {
    cargando.value = false
  }
}

const nuevaReserva = () => {
  reservaExitosa.value = false
  correoConfirmacionEnviado.value = false
  formulario.nombre = ''
  formulario.email = ''
  formulario.telefono = ''
  formulario.fecha = ''
  formulario.hora = ''
  formulario.personas = '2'
  error.value = ''
  llenarDatosUsuarioGoogle()
}

onMounted(() => {
  llenarDatosUsuarioGoogle()
})
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
