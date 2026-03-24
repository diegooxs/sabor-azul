<script setup>
import { RouterView } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue'
</script>

<template>
  <AppNavbar />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <footer class="bg-dark text-white text-center py-5 mt-auto w-100">
    <div class="container">
      <h4
        class="fw-bold mb-3 text-white"
        style="font-family: 'Times New Roman', serif; font-style: italic; letter-spacing: 1px"
      >
        Sabor Azul
      </h4>

      <p class="text-white-50 small mb-4">
        Síguenos en nuestras redes sociales para conocer nuestros nuevos platillos, eventos
        especiales y promociones exclusivas.
      </p>

      <hr
        class="mx-auto mb-4"
        style="width: 150px; border-color: #dee2e6; border-width: 2px; opacity: 0.3"
      />

      <div class="d-flex justify-content-center gap-4">
        <a href="#" class="text-white-50 fs-3"><i class="bi bi-instagram"></i></a>
        <a href="#" class="text-white-50 fs-3"><i class="bi bi-facebook"></i></a>
        <a href="#" class="text-white-50 fs-3"><i class="bi bi-twitter-x"></i></a>
      </div>

      <div class="mt-5 pt-3 border-top border-secondary opacity-50 small text-white">
        © 2026 Sabor Azul. Todos los derechos reservados.
      </div>
    </div>
  </footer>
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
body {
  background-color: #f8f9fa;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>
