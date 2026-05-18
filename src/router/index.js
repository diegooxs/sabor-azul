import { createRouter, createWebHashHistory } from 'vue-router'
import { datosUsuario } from '@/store/usuario'

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
import AdminReservasView from '@/views/AdminReservasView.vue'
import AdminContactoView from '@/views/AdminContactoView.vue'

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
    meta: { requiereAuth: true },
  },
  {
    path: '/admin',
    name: 'adminMenu',
    component: AdminMenuView,
    meta: { requiereAdmin: true },
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
    meta: { requiereAdmin: true },
  },
  {
    path: '/admin/pedidos',
    name: 'admin-pedidos',
    component: AdminPedidosView,
    meta: { requiereAdmin: true },
  },
  {
    path: '/admin/reservas',
    name: 'admin-reservas',
    component: AdminReservasView,
    meta: { requiereAdmin: true },
  },
  {
    path: '/admin/contacto',
    name: 'admin-contacto',
    component: AdminContactoView,
    meta: { requiereAdmin: true },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const requiereAdmin = to.matched.some((record) => record.meta.requiereAdmin)
  const requiereAuth = to.matched.some((record) => record.meta.requiereAuth)

  if (requiereAdmin && datosUsuario.rol !== 'admin') {
    return datosUsuario.estaAutenticado ? '/' : '/login'
  }

  if (requiereAuth && !datosUsuario.estaAutenticado) {
    return '/login'
  }

  if (to.path === '/login' && datosUsuario.estaAutenticado) {
    return datosUsuario.rol === 'admin' ? '/admin' : '/'
  }
})

export default router
