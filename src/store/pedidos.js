import { reactive } from 'vue'

const STORAGE_KEY = 'sabor-azul-pedidos'

const leerPedidosGuardados = () => {
  if (typeof window === 'undefined') return []

  try {
    const pedidos = window.localStorage.getItem(STORAGE_KEY)
    return pedidos ? JSON.parse(pedidos) : []
  } catch (error) {
    console.error('No se pudieron leer los pedidos guardados:', error)
    return []
  }
}

const guardarPedidos = (pedidos) => {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos))
}

export const estadoPedidos = reactive({
  items: leerPedidosGuardados(),

  crearPedido({ cliente, productos, total }) {
    const nuevoPedido = {
      id: `PED-${Date.now()}`,
      cliente: cliente || 'Cliente',
      fecha: new Date().toISOString(),
      estado: 'Pendiente',
      total,
      productos,
    }

    this.items.unshift(nuevoPedido)
    guardarPedidos(this.items)
    return nuevoPedido
  },

  actualizarEstado(id, estado) {
    const pedido = this.items.find((item) => item.id === id)
    if (!pedido) return

    pedido.estado = estado
    guardarPedidos(this.items)
  },

  eliminarPedido(id) {
    this.items = this.items.filter((item) => item.id !== id)
    guardarPedidos(this.items)
  },
})
