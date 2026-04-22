import { reactive } from 'vue'

export const estadoMenu = reactive({
  urlApi: 'https://backend-sabor-azul.onrender.com/api/platillos',
  urlCategorias: 'https://backend-sabor-azul.onrender.com/api/categorias',
  cargando: false,
  error: '',
  platillos: [],
  categorias: [],
  mapaCategoriasId: {}, // id -> nombre

  normalizarPlatillo(platillo) {
    return {
      ...platillo,
      precio: Number(platillo.precio) || 0,
      categoria_id: platillo.categoria_id,
      categoria: platillo.categoria?.nombre || platillo.categoria || 'Sin Categoría',
    }
  },

  async cargarCategorias() {
    try {
      const respuesta = await fetch(this.urlCategorias)
      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.message || 'No se pudo cargar las categorías')
      }

      this.categorias = datos
      // Crear mapa para búsqueda rápida de nombres por ID
      this.mapaCategoriasId = {}
      datos.forEach(cat => {
        this.mapaCategoriasId[cat.id] = cat.nombre
      })
    } catch (error) {
      console.error('Error al cargar categorías:', error)
      this.error = 'No se pudo cargar las categorías'
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
    this.cargando = true
    try {
      const respuesta = await fetch(this.urlApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nuevoPlatillo.nombre,
          descripcion: nuevoPlatillo.descripcion,
          precio: Number(nuevoPlatillo.precio),
          imagen: nuevoPlatillo.imagen,
          categoria_id: parseInt(nuevoPlatillo.categoria_id),
        }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.message || 'Error al crear el platillo')
      }

      this.platillos.push(this.normalizarPlatillo(datos))
      return true // Éxito
    } catch (error) {
      console.error('Error en agregarPlatillo:', error)
      this.error = error.message
      throw error
    } finally {
      this.cargando = false
    }
  },

  async editarPlatillo(platilloEditado) {
    const respuesta = await fetch(`${this.urlApi}/${platilloEditado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: platilloEditado.nombre,
        descripcion: platilloEditado.descripcion,
        precio: Number(platilloEditado.precio),
        imagen: platilloEditado.imagen,
        categoria_id: Number(platilloEditado.categoria_id),
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
