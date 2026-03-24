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
              type="email"
              class="form-control rounded-3"
              id="emailInput"
              v-model="emailLogin"
              placeholder="nombre@ejemplo.com"
              required
            />
            <label for="emailInput" class="text-muted">Correo electrónico</label>
          </div>

          <div class="form-floating mb-4 text-start">
            <input
              type="password"
              class="form-control rounded-3"
              id="passwordInput"
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

        <div class="mt-4 pt-3 border-top">
          <a href="#" class="text-muted text-decoration-none small">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { datosUsuario } from '../store/usuario'

const router = useRouter()
const emailLogin = ref('')

const iniciarSesion = () => {
  datosUsuario.iniciarSesion(emailLogin.value)

  if (datosUsuario.rol === 'admin') {
    router.push('/admin')
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  transition: all 0.2s;
}
</style>
