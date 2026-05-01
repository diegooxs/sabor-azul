import { reactive } from 'vue'
import { API_BASE_URL, buildApiUrl } from '../config/api'

const STORAGE_KEY = 'sabor-azul-usuario'

const estadoInicial = {
  id: null,
  nombre: 'Invitado',
  apellido: '',
  email: '',
  telefono: '',
  foto: 'https://ui-avatars.com/api/?name=Invitado&background=6c757d&color=fff',
  rol: 'invitado',
}

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

const leerSesionGuardada = () => {
  if (typeof window === 'undefined') return { ...estadoInicial }

  try {
    const sesion = window.localStorage.getItem(STORAGE_KEY)

    if (!sesion) {
      return { ...estadoInicial }
    }

    return {
      ...estadoInicial,
      ...JSON.parse(sesion),
    }
  } catch (error) {
    console.error('No se pudo restaurar la sesión guardada:', error)
    return { ...estadoInicial }
  }
}

const guardarSesion = (usuario) => {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      foto: usuario.foto,
      rol: usuario.rol,
    }),
  )
}

const limpiarSesionGuardada = () => {
  if (typeof window === 'undefined') return

  window.localStorage.removeItem(STORAGE_KEY)
}

const sesionInicial = leerSesionGuardada()

export const datosUsuario = reactive({
  id: sesionInicial.id,
  nombre: sesionInicial.nombre,
  apellido: sesionInicial.apellido,
  email: sesionInicial.email,
  telefono: sesionInicial.telefono,
  foto: sesionInicial.foto,
  rol: sesionInicial.rol,
  urlApi: API_BASE_URL,

  get estaAutenticado() {
    return this.rol !== 'invitado'
  },

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
        guardarSesion(this)

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

  async iniciarSesionGoogle(credential) {
    try {
      const respuesta = await fetch(buildApiUrl('/login-google'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.message || 'No se pudo iniciar sesión con Google')
      }

      this.id = datos.id ?? null
      this.nombre = datos.username || datos.email || 'Usuario Google'
      this.rol = datos.rol || 'cliente'
      this.email = datos.email || ''
      this.foto =
        datos.foto ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(this.nombre)}&background=1a365d&color=fff`
      guardarSesion(this)

      return { success: true }
    } catch (error) {
      console.error('Error iniciando sesión con Google:', error)
      return { success: false, message: error.message }
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
    Object.assign(this, estadoInicial)
    limpiarSesionGuardada()
  },

  actualizarPerfil({ nombre, apellido, email, telefono }) {
    this.nombre = nombre?.trim() || this.nombre
    this.apellido = apellido?.trim() || ''
    this.email = email?.trim() || ''
    this.telefono = telefono?.trim() || ''

    const nombreCompleto = [this.nombre, this.apellido].filter(Boolean).join(' ')
    this.foto = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreCompleto || this.nombre)}&background=1a365d&color=fff`
    guardarSesion(this)
  },
})
