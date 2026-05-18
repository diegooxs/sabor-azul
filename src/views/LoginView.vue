<template>
  <div
    class="min-vh-100 d-flex align-items-center justify-content-center"
    style="background-color: #f8f9fa"
  >
    <div class="card shadow-lg border-0 rounded-4" style="max-width: 420px; width: 100%">
      <div class="card-body p-5 text-center">
        <div class="mb-4">
          <img
            src="/logo-login.png"
            alt="Sabor Azul Logo"
            class="rounded-circle p-2 shadow-sm"
            style="width: 80px; height: 80px; object-fit: contain; background-color: #0f172a"
          />
        </div>

        <h3
          class="fw-bold mb-1 text-dark"
          style="font-family: 'Times New Roman', serif; letter-spacing: 1px"
        >
          Bienvenido
        </h3>
        <p class="text-muted small mb-4">Ingresa tus credenciales para continuar</p>

        <form @submit.prevent="iniciarSesion">
          <div class="form-floating mb-3 text-start">
            <input
              type="text"
              class="form-control rounded-3"
              id="userInput"
              v-model="nombreUsuario"
              placeholder="Usuario"
              required
            />
            <label for="userInput" class="text-muted">Usuario</label>
          </div>

          <div class="form-floating mb-4 text-start">
            <input
              type="password"
              class="form-control rounded-3"
              id="passwordInput"
              v-model="passwordLogin"
              placeholder="Contraseña"
              required
            />
            <label for="passwordInput" class="text-muted">Contraseña</label>
          </div>

          <button
            type="submit"
            class="btn w-100 rounded-pill py-2 fw-bold text-white text-uppercase"
            style="background-color: #0f172a; letter-spacing: 1px"
          >
            Entrar
          </button>
        </form>

        <div class="my-4 d-flex align-items-center gap-3">
          <hr class="flex-grow-1" />
          <span class="text-muted small">o</span>
          <hr class="flex-grow-1" />
        </div>

        <div v-if="googleDisponible" ref="googleButton" class="google-button-wrapper"></div>
        <button
          v-else
          type="button"
          class="btn btn-outline-dark w-100 rounded-pill py-2 fw-bold"
          disabled
        >
          <i class="bi bi-google me-2"></i>Configura Google Client ID
        </button>
        <p v-if="errorGoogle" class="text-danger small mt-3 mb-0">{{ errorGoogle }}</p>

        <div class="mt-4 pt-3 border-top">
          <button
            type="button"
            class="btn btn-link text-muted text-decoration-none small p-0"
            @click="mostrarRecuperacion = !mostrarRecuperacion"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <form
          v-if="mostrarRecuperacion"
          class="password-reset mt-4 text-start"
          @submit.prevent="recuperarPassword"
        >
          <p class="text-muted small mb-3 text-center">
            Escribe tu usuario y crea una nueva contraseña.
          </p>

          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control rounded-3"
              id="resetUserInput"
              v-model="usuarioRecuperacion"
              placeholder="Usuario"
              required
            />
            <label for="resetUserInput" class="text-muted">Usuario</label>
          </div>

          <div class="form-floating mb-3">
            <input
              type="password"
              class="form-control rounded-3"
              id="resetPasswordInput"
              v-model="nuevaPassword"
              placeholder="Nueva contraseña"
              minlength="6"
              required
            />
            <label for="resetPasswordInput" class="text-muted">Nueva contraseña</label>
          </div>

          <div class="form-floating mb-3">
            <input
              type="password"
              class="form-control rounded-3"
              id="confirmPasswordInput"
              v-model="confirmarPassword"
              placeholder="Confirmar contraseña"
              minlength="6"
              required
            />
            <label for="confirmPasswordInput" class="text-muted">Confirmar contraseña</label>
          </div>

          <div v-if="mensajeRecuperacion" :class="['small text-center mb-3', mensajeClase]">
            {{ mensajeRecuperacion }}
          </div>

          <button
            type="submit"
            class="btn btn-outline-dark w-100 rounded-pill py-2 fw-bold"
            :disabled="recuperando"
          >
            {{ recuperando ? 'Actualizando...' : 'Actualizar contraseña' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GOOGLE_CLIENT_ID, datosUsuario } from '../store/usuario'

const router = useRouter()
const googleButton = ref(null)
const nombreUsuario = ref('')
const passwordLogin = ref('')
const mostrarRecuperacion = ref(false)
const usuarioRecuperacion = ref('')
const nuevaPassword = ref('')
const confirmarPassword = ref('')
const mensajeRecuperacion = ref('')
const mensajeClase = ref('text-muted')
const recuperando = ref(false)
const errorGoogle = ref('')
const googleDisponible = computed(() => Boolean(GOOGLE_CLIENT_ID))

const redirigirDespuesLogin = () => {
  if (datosUsuario.rol === 'admin') {
    router.push('/admin')
  } else {
    router.push('/')
  }
}

const iniciarSesion = async () => {
  const resultado = await datosUsuario.iniciarSesion(nombreUsuario.value, passwordLogin.value)

  if (resultado.success) {
    redirigirDespuesLogin()
  } else {
    passwordLogin.value = ''
  }
}

const manejarGoogleCredential = async (response) => {
  errorGoogle.value = ''
  const resultado = await datosUsuario.iniciarSesionGoogle(response.credential)

  if (resultado.success) {
    redirigirDespuesLogin()
  } else {
    errorGoogle.value = resultado.message || 'No se pudo iniciar sesión con Google'
  }
}

const renderizarGoogleButton = async () => {
  if (!googleDisponible.value) return

  await nextTick()

  for (let intento = 0; intento < 20 && !window.google?.accounts?.id; intento++) {
    await new Promise((resolve) => window.setTimeout(resolve, 150))
  }

  if (!window.google?.accounts?.id || !googleButton.value) {
    errorGoogle.value = 'No se pudo cargar el botón de Google. Intenta recargar la página.'
    return
  }

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: manejarGoogleCredential,
  })

  window.google.accounts.id.renderButton(googleButton.value, {
    theme: 'outline',
    size: 'large',
    shape: 'pill',
    width: 320,
    text: 'signin_with',
  })
}

const limpiarRecuperacion = () => {
  nuevaPassword.value = ''
  confirmarPassword.value = ''
}

const recuperarPassword = async () => {
  mensajeRecuperacion.value = ''

  if (nuevaPassword.value !== confirmarPassword.value) {
    mensajeClase.value = 'text-danger'
    mensajeRecuperacion.value = 'Las contraseñas no coinciden'
    return
  }

  recuperando.value = true
  const resultado = await datosUsuario.recuperarPassword(
    usuarioRecuperacion.value,
    nuevaPassword.value,
  )
  recuperando.value = false

  if (resultado.success) {
    mensajeClase.value = 'text-success'
    mensajeRecuperacion.value = 'Contraseña actualizada. Ya puedes iniciar sesión.'
    nombreUsuario.value = usuarioRecuperacion.value
    passwordLogin.value = ''
    limpiarRecuperacion()
  } else {
    mensajeClase.value = 'text-danger'
    mensajeRecuperacion.value = resultado.message
  }
}

onMounted(() => {
  renderizarGoogleButton()
})
</script>

<style scoped>
.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  transition: all 0.2s;
}

.form-control:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 0.25rem rgba(15, 23, 42, 0.25);
}

.password-reset {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1rem;
}

.google-button-wrapper {
  display: flex;
  justify-content: center;
  min-height: 44px;
  max-width: 100%;
  overflow: hidden;
}

@media (max-width: 575.98px) {
  .min-vh-100 {
    align-items: flex-start !important;
    padding: 5rem 1rem 2rem;
  }

  .card {
    max-width: 100% !important;
  }

  .card-body {
    padding: 1.5rem !important;
  }
}
</style>
