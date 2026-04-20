<template>
  <div class="container mt-5">
    <h2 class="mb-4">Administración de Usuarios</h2>

    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">{{ editando ? 'Editar Usuario' : 'Agregar Nuevo Usuario' }}</h5>
        <form @submit.prevent="guardarUsuario">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Nombre de Usuario</label>
              <input type="text" class="form-control" v-model="form.username" required />
            </div>
            <div class="col-md-4">
              <label class="form-label"
                >Contraseña <small v-if="editando">(Deja en blanco para no cambiarla)</small></label
              >
              <input
                type="password"
                class="form-control"
                v-model="form.password"
                :required="!editando"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">Rol</label>
              <select class="form-select" v-model="form.rol" required>
                <option value="admin">Administrador</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>
            <div class="col-md-1 d-flex align-items-end">
              <button type="submit" class="btn btn-primary w-100">
                {{ editando ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </div>
        </form>
        <button v-if="editando" @click="cancelarEdicion" class="btn btn-secondary btn-sm mt-3">
          Cancelar Edición
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usuarios" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>
              <span class="badge bg-info text-dark">{{ user.rol }}</span>
            </td>
            <td>
              <button @click="editarUsuario(user)" class="btn btn-warning btn-sm me-2">
                Editar
              </button>
              <button @click="eliminarUsuario(user.id)" class="btn btn-danger btn-sm">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //urlApi: 'http://10.20.130.143:8000/api/usuarios',
      // Asegúrate de que tenga el "/usuarios" al final
      urlApi: 'https://backend-sabor-azul.onrender.com/api/usuarios',
      usuarios: [],
      editando: false,
      form: { id: null, username: '', password: '', rol: 'cliente' },
    }
  },
  mounted() {
    this.cargarUsuarios()
  },
  methods: {
    async cargarUsuarios() {
      try {
        const res = await fetch(this.urlApi)
        this.usuarios = await res.json()
      } catch (error) {
        console.error('Error al cargar usuarios:', error)
      }
    },
    async guardarUsuario() {
      try {
        const url = this.editando ? `${this.urlApi}/${this.form.id}` : this.urlApi

        await fetch(url, {
          method: 'POST', // Tu backend usa POST incluso para actualizar y crear
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form),
        })

        this.form = { id: null, username: '', password: '', rol: 'cliente' }
        this.editando = false
        this.cargarUsuarios()
      } catch (error) {
        console.error('Error al guardar:', error)
      }
    },
    editarUsuario(user) {
      this.editando = true
      this.form.id = user.id
      this.form.username = user.username
      this.form.password = '' // Se deja en blanco por seguridad
      this.form.rol = user.rol
    },
    cancelarEdicion() {
      this.editando = false
      this.form = { id: null, username: '', password: '', rol: 'cliente' }
    },
    async eliminarUsuario(id) {
      if (confirm('¿Estás seguro de eliminar este usuario?')) {
        try {
          await fetch(`${this.urlApi}/${id}`, { method: 'DELETE' })
          this.cargarUsuarios()
        } catch (error) {
          console.error('Error al eliminar:', error)
        }
      }
    },
  },
}
</script>
