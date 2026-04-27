import { reactive } from 'vue'
import { buildApiUrl } from '../config/api'

export const estadoMensajesContacto = reactive({
  urlApi: buildApiUrl('/mensajes-contacto'),
  cargando: false,
  error: '',
  mensajes: [],

  async cargarMensajes() {
    this.cargando = true
    this.error = ''

    try {
      const respuesta = await fetch(this.urlApi)
      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.message || 'No se pudieron cargar los mensajes')
      }

      this.mensajes = datos
    } catch (error) {
      console.error('Error al cargar mensajes de contacto:', error)
      this.error = 'No se pudieron cargar los mensajes desde el servidor'
      throw error
    } finally {
      this.cargando = false
    }
  },

  async crearMensaje(nuevoMensaje) {
    this.cargando = true
    this.error = ''

    try {
      const respuesta = await fetch(this.urlApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoMensaje),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.message || 'No se pudo enviar el mensaje')
      }

      this.mensajes.unshift(datos)
      return datos
    } catch (error) {
      console.error('Error al enviar mensaje de contacto:', error)
      this.error = error.message
      throw error
    } finally {
      this.cargando = false
    }
  },

  async eliminarMensaje(id) {
    this.cargando = true
    this.error = ''

    try {
      const respuesta = await fetch(`${this.urlApi}/${id}`, {
        method: 'DELETE',
      })

      if (!respuesta.ok) {
        const datos = await respuesta.json()
        throw new Error(datos.error || datos.message || 'No se pudo eliminar el mensaje')
      }

      this.mensajes = this.mensajes.filter((mensaje) => mensaje.id !== id)
    } catch (error) {
      console.error('Error al eliminar mensaje de contacto:', error)
      this.error = error.message
      throw error
    } finally {
      this.cargando = false
    }
  },
})
