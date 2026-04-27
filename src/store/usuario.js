import { reactive } from 'vue'
import { API_BASE_URL, buildApiUrl } from '../config/api'

export const datosUsuario = reactive({
  id: null,
  nombre: 'Invitado',
  apellido: '',
  email: '',
  telefono: '',
  foto: 'https://ui-avatars.com/api/?name=Invitado&background=6c757d&color=fff',
  rol: 'invitado',
  urlApi: API_BASE_URL,

  async iniciarSesion(username, password) {
    try {
      const respuesta = await fetch(buildApiUrl('/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const datos = await respuesta.json()

      if (respuesta.ok) {
        this.id = datos.id ?? null
        this.nombre = datos.username
        this.rol = datos.rol
        this.email = username
        this.foto = `https://ui-avatars.com/api/?name=${datos.username}&background=1a365d&color=fff`

        return { success: true }
      } else {
        alert(datos.message || 'Credenciales incorrectas')
        return { success: false }
      }
    } catch (error) {
      console.error('Error conectando al servidor:', error)
      alert('No se pudo conectar con el servidor de Sabor Azul')
      return { success: false }
    }
  },

  async recuperarPassword(username, nuevaPassword) {
    try {
      const respuesta = await fetch(buildApiUrl('/recuperar-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, nuevaPassword }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.message || datos.error || 'No se pudo actualizar la contraseña')
      }

      return { success: true, message: datos.message }
    } catch (error) {
      console.error('Error al recuperar contraseña:', error)
      return { success: false, message: error.message }
    }
  },

  cerrarSesion() {
    this.id = null
    this.nombre = 'Invitado'
    this.rol = 'invitado'
    this.email = ''
    this.foto = 'https://ui-avatars.com/api/?name=Invitado&background=6c757d&color=fff'
  },

  actualizarPerfil({ nombre, apellido, email, telefono }) {
    this.nombre = nombre?.trim() || this.nombre
    this.apellido = apellido?.trim() || ''
    this.email = email?.trim() || ''
    this.telefono = telefono?.trim() || ''

    const nombreCompleto = [this.nombre, this.apellido].filter(Boolean).join(' ')
    this.foto = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreCompleto || this.nombre)}&background=1a365d&color=fff`
  },
})
