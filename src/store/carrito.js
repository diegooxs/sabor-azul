import { reactive } from 'vue'

export const estadoCarrito = reactive({
  items: [],
  ultimaAccion: 0,
  ultimoProductoAgregado: null,

  get totalArticulos() {
    return this.items.reduce((total, item) => total + item.cantidad, 0)
  },

  get totalPrecio() {
    return this.items.reduce((total, item) => total + item.precio * item.cantidad, 0)
  },

  agregar(platillo) {
    const existe = this.items.find((item) => item.id === platillo.id)
    if (existe) {
      existe.cantidad++
    } else {
      this.items.push({ ...platillo, cantidad: 1 })
    }

    this.ultimoProductoAgregado = platillo.nombre
    this.ultimaAccion++
  },

  actualizarCantidad(id, cantidad) {
    const item = this.items.find((producto) => producto.id === id)

    if (!item) return

    if (cantidad <= 0) {
      this.eliminar(id)
      return
    }

    item.cantidad = cantidad
  },

  quitar(id) {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      if (this.items[index].cantidad > 1) {
        this.items[index].cantidad--
      } else {
        this.items.splice(index, 1)
      }
    }
  },

  eliminar(id) {
    this.items = this.items.filter((item) => item.id !== id)
  },

  vaciar() {
    this.items = []
  },
})
