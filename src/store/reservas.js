import { reactive } from 'vue'
import { buildApiUrl } from '../config/api'

export const estadoReservas = reactive({
  urlApi: buildApiUrl('/reservas'),
  cargando: false,
  error: '',
  reservas: [],

  async cargarReservas() {
    this.cargando = true
    this.error = ''

    try {
      const respuesta = await fetch(this.urlApi)
      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.message || 'No se pudo cargar las reservas')
      }

      this.reservas = datos
    } catch (error) {
      console.error('Error al cargar reservas:', error)
      this.error = 'No se pudo cargar las reservas desde el servidor'
    } finally {
      this.cargando = false
    }
  },

  async crearReserva(nuevaReserva) {
    this.cargando = true
    try {
      const respuesta = await fetch(this.urlApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nuevaReserva.nombre,
          email: nuevaReserva.email,
          telefono: nuevaReserva.telefono,
          fecha: nuevaReserva.fecha,
          hora: nuevaReserva.hora,
          personas: Number(nuevaReserva.personas),
          enviarConfirmacionEmail: Boolean(nuevaReserva.enviarConfirmacionEmail),
        }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.message || 'Error al crear la reserva')
      }

      this.reservas.unshift(datos)
      return datos
    } catch (error) {
      console.error('Error en crearReserva:', error)
      this.error = error.message
      throw error
    } finally {
      this.cargando = false
    }
  },

  async actualizarReserva(reservaEditada) {
    this.cargando = true
    try {
      const respuesta = await fetch(`${this.urlApi}/${reservaEditada.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaEditada),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.message || 'No se pudo actualizar la reserva')
      }

      const indice = this.reservas.findIndex((r) => r.id === reservaEditada.id)
      if (indice !== -1) {
        this.reservas[indice] = datos
      }
      return true
    } catch (error) {
      console.error('Error en actualizarReserva:', error)
      this.error = error.message
      throw error
    } finally {
      this.cargando = false
    }
  },

  async eliminarReserva(id) {
    this.cargando = true
    try {
      const respuesta = await fetch(`${this.urlApi}/${id}`, {
        method: 'DELETE',
      })

      if (!respuesta.ok) {
        const datos = await respuesta.json()
        throw new Error(datos.message || 'No se pudo eliminar la reserva')
      }

      this.reservas = this.reservas.filter((r) => r.id !== id)
      return true
    } catch (error) {
      console.error('Error en eliminarReserva:', error)
      this.error = error.message
      throw error
    } finally {
      this.cargando = false
    }
  },

  async actualizarEstado(id, estado) {
    this.cargando = true
    try {
      const respuesta = await fetch(`${this.urlApi}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.message || 'No se pudo actualizar el estado')
      }

      const indice = this.reservas.findIndex((r) => r.id === id)
      if (indice !== -1) {
        this.reservas[indice] = datos
      }
      return true
    } catch (error) {
      console.error('Error en actualizarEstado:', error)
      this.error = error.message
      throw error
    } finally {
      this.cargando = false
    }
  },
})
