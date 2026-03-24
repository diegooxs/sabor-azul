import { reactive } from 'vue'

export const datosUsuario = reactive({
  nombre: 'Invitado',
  apellido: '',
  email: '',
  telefono: '',
  foto: 'https://ui-avatars.com/api/?name=Invitado&background=6c757d&color=fff',
  rol: 'invitado',

  iniciarSesion(correo) {
    if (correo === 'admin@saborazul.com') {
      this.nombre = 'Admin'
      this.apellido = 'Principal'
      this.email = correo
      this.rol = 'admin'
      this.foto = 'https://ui-avatars.com/api/?name=Admin&background=dc3545&color=fff'
    } else {
      this.nombre = 'Santiago'
      this.apellido = 'González'
      this.email = correo
      this.telefono = '951 123 4567'
      this.rol = 'cliente'
      this.foto = 'https://ui-avatars.com/api/?name=Santiago+G&background=1a365d&color=fff'
    }
  },

  cerrarSesion() {
    this.nombre = 'Invitado'
    this.rol = 'invitado'
  },

  actualizarPerfil(nuevosDatos) {
    this.nombre = nuevosDatos.nombre
    this.apellido = nuevosDatos.apellido
    this.email = nuevosDatos.email
    this.telefono = nuevosDatos.telefono
  },
})
