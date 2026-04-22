import { reactive } from 'vue'

export const estadoMenu = reactive({
  urlApi: 'https://backend-sabor-azul.onrender.com/api/platillos',
  cargando: false,
  error: '',
  platillos: [],

  normalizarPlatillo(platillo) {
    return {
      ...platillo,
      precio: Number(platillo.precio) || 0,
      categoria: platillo.categoria?.nombre || platillo.categoria || 'Sin Categoría',
    }
  },

  async cargarPlatillos() {
    this.cargando = true
    this.error = ''

    try {
      const respuesta = await fetch(this.urlApi)
      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.message || 'No se pudo cargar el menú')
      }

      this.platillos = datos.map((platillo) => this.normalizarPlatillo(platillo))
    } catch (error) {
      console.error('Error al cargar platillos:', error)
      this.error = 'No se pudo cargar el menú desde el servidor'
    } finally {
      this.cargando = false
    }
  },

  async agregarPlatillo(nuevoPlatillo) {
    const respuesta = await fetch(this.urlApi, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...nuevoPlatillo,
        precio: Number(nuevoPlatillo.precio),
      }),
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.message || 'No se pudo crear el platillo')
    }

    this.platillos.push(this.normalizarPlatillo(datos))
  },

  async editarPlatillo(platilloEditado) {
    const respuesta = await fetch(`${this.urlApi}/${platilloEditado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...platilloEditado,
        precio: Number(platilloEditado.precio),
      }),
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.message || 'No se pudo actualizar el platillo')
    }

    const indice = this.platillos.findIndex((p) => p.id === platilloEditado.id)
    if (indice !== -1) {
      this.platillos[indice] = this.normalizarPlatillo(datos)
    }
  },

  async eliminarPlatillo(id) {
    const respuesta = await fetch(`${this.urlApi}/${id}`, {
      method: 'DELETE',
    })

    if (!respuesta.ok) {
      const datos = await respuesta.json()
      throw new Error(datos.message || 'No se pudo eliminar el platillo')
    }

    this.platillos = this.platillos.filter((p) => p.id !== id)
  },
})
