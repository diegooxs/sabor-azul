import { reactive } from 'vue'

export const estadoCarrito = reactive({
  items: [],

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
  vaciar() {
    this.items = []
  },
})
