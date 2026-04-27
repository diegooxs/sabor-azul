import { reactive } from 'vue'
import { buildApiUrl } from '../config/api'

export const estadoPedidos = reactive({
  urlApi: buildApiUrl('/pedidos'),
  cargando: false,
  error: '',
  items: [],

  normalizarPedido(pedido) {
    return {
      ...pedido,
      id: Number(pedido.id),
      user_id: pedido.user_id == null ? null : Number(pedido.user_id),
      total: Number(pedido.total) || 0,
      fecha: pedido.fecha || pedido.created_at || new Date().toISOString(),
      productos: Array.isArray(pedido.productos)
        ? pedido.productos.map((producto) => ({
            ...producto,
            id: producto.id == null ? null : Number(producto.id),
            platillo_id: producto.platillo_id == null ? null : Number(producto.platillo_id),
            detalle_id: producto.detalle_id == null ? null : Number(producto.detalle_id),
            cantidad: Number(producto.cantidad) || 0,
            precio: Number(producto.precio) || 0,
            subtotal: Number(producto.subtotal) || 0,
          }))
        : [],
    }
  },

  async cargarPedidos() {
    this.cargando = true
    this.error = ''

    try {
      const respuesta = await fetch(this.urlApi)
      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.message || 'No se pudieron cargar los pedidos')
      }

      this.items = datos.map((pedido) => this.normalizarPedido(pedido))
    } catch (error) {
      console.error('No se pudieron cargar los pedidos:', error)
      this.error = error.message || 'No se pudieron cargar los pedidos'
      throw error
    } finally {
      this.cargando = false
    }
  },

  async crearPedido({ cliente, productos, total, user_id = null }) {
    this.cargando = true
    this.error = ''

    try {
      const respuesta = await fetch(this.urlApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente,
          user_id,
          total: Number(total),
          productos: productos.map((producto) => ({
            id: producto.id,
            nombre: producto.nombre,
            cantidad: Number(producto.cantidad),
            precio: Number(producto.precio),
          })),
        }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.message || 'No se pudo crear el pedido')
      }

      const pedido = this.normalizarPedido(datos)
      this.items.unshift(pedido)
      return pedido
    } catch (error) {
      console.error('No se pudo crear el pedido:', error)
      this.error = error.message || 'No se pudo crear el pedido'
      throw error
    } finally {
      this.cargando = false
    }
  },

  async actualizarEstado(id, estado) {
    this.cargando = true
    this.error = ''

    try {
      const respuesta = await fetch(`${this.urlApi}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.message || 'No se pudo actualizar el pedido')
      }

      const pedidoActualizado = this.normalizarPedido(datos)
      const indice = this.items.findIndex((item) => item.id === pedidoActualizado.id)

      if (indice !== -1) {
        this.items[indice] = pedidoActualizado
      }

      return pedidoActualizado
    } catch (error) {
      console.error('No se pudo actualizar el pedido:', error)
      this.error = error.message || 'No se pudo actualizar el pedido'
      throw error
    } finally {
      this.cargando = false
    }
  },

  async eliminarPedido(id) {
    this.cargando = true
    this.error = ''

    try {
      const respuesta = await fetch(`${this.urlApi}/${id}`, {
        method: 'DELETE',
      })

      if (!respuesta.ok) {
        const datos = await respuesta.json()
        throw new Error(datos.error || datos.message || 'No se pudo eliminar el pedido')
      }

      this.items = this.items.filter((item) => item.id !== id)
    } catch (error) {
      console.error('No se pudo eliminar el pedido:', error)
      this.error = error.message || 'No se pudo eliminar el pedido'
      throw error
    } finally {
      this.cargando = false
    }
  },
})
