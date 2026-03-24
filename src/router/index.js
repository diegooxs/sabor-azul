import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import MenuView from '../views/MenuView.vue'
import LoginView from '../views/LoginView.vue'
import ContactView from '../views/ContactView.vue'
import ReservasView from '../views/ReservasView.vue'
import PerfilView from '../views/PerfilView.vue'
import AdminMenuView from '../views/AdminMenuView.vue'
import GaleriaView from '@/views/GaleriaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/menu', name: 'menu', component: MenuView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/contacto', name: 'contacto', component: ContactView },
    { path: '/reservas', name: 'reservas', component: ReservasView },
    { path: '/perfil', name: 'perfil', component: PerfilView },

    { path: '/admin', name: 'adminMenu', component: AdminMenuView },
    { path: '/galeria', name: 'galeria', component: GaleriaView },
  ],
})

export default router
