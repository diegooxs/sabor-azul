import { reactive } from 'vue'

export const datosUsuario = reactive({
  nombre: 'Invitado',
  apellido: '',
  email: '',
  telefono: '',
  foto: 'https://ui-avatars.com/api/?name=Invitado&background=6c757d&color=fff',
  rol: 'invitado',

  //urlApi: 'http://10.20.130.143:8000/api',x
  // Asegúrate de que tenga el "/usuarios" al final
  urlApi: 'https://backend-sabor-azul.onrender.com/api',

  async iniciarSesion(username, password) {
    try {
      const respuesta = await fetch(`${this.urlApi}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const datos = await respuesta.json()

      if (respuesta.ok) {
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
      const respuesta = await fetch(`${this.urlApi}/recuperar-password`, {
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
    this.nombre = 'Invitado'
    this.rol = 'invitado'
    this.email = ''
    this.foto = 'https://ui-avatars.com/api/?name=Invitado&background=6c757d&color=fff'
  },
})
