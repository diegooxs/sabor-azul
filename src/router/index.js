import { createRouter, createWebHashHistory } from 'vue-router'

// Importaciones de Vistas
import HomeView from '@/views/HomeView.vue'
import MenuView from '@/views/MenuView.vue'
import LoginView from '@/views/LoginView.vue'
import ContactView from '@/views/ContactView.vue'
import ReservasView from '@/views/ReservasView.vue'
import PerfilView from '@/views/PerfilView.vue'
import AdminMenuView from '@/views/AdminMenuView.vue'
import GaleriaView from '@/views/GaleriaView.vue'
import AdminUsuariosView from '@/views/AdminUsuariosView.vue'
import AdminPedidosView from '@/views/AdminPedidosView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/menu',
    name: 'menu',
    component: MenuView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/contacto',
    name: 'contacto',
    component: ContactView,
  },
  {
    path: '/reservas',
    name: 'reservas',
    component: ReservasView,
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: PerfilView,
  },
  {
    path: '/admin',
    name: 'adminMenu',
    component: AdminMenuView,
  },
  {
    path: '/galeria',
    name: 'galeria',
    component: GaleriaView,
  },
  {
    path: '/admin/usuarios',
    name: 'admin-usuarios',
    component: AdminUsuariosView,
  },
  {
    path: '/admin/pedidos',
    name: 'admin-pedidos',
    component: AdminPedidosView,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
