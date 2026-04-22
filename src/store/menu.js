import { reactive } from 'vue'

export const estadoMenu = reactive({
  urlApi: 'https://backend-sabor-azul.onrender.com/api/platillos',
  cargando: false,
  error: '',
  platillos: [
    {
      id: 1,
      nombre: 'Salmón al Romero',
      descripcion: 'Filete de salmón fresco glaseado, sobre cama de espárragos.',
      precio: 340.0,
      imagen: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=80',
      categoria: 'Plato Fuerte',
    },
    {
      id: 2,
      nombre: 'Pasta Trufada',
      descripcion: 'Linguini artesanal con crema de trufa negra y parmesano.',
      precio: 280.0,
      imagen: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&q=80',
      categoria: 'Pastas',
    },
    {
      id: 3,
      nombre: 'Ensalada Huerto Azul',
      descripcion: 'Mix de hojas verdes, frutos rojos, nuez caramelizada y vinagreta.',
      precio: 160.0,
      imagen: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
      categoria: 'Entradas',
    },
    {
      id: 101,
      nombre: 'Ensalada César',
      descripcion: 'Lechuga orejona, aderezo artesanal y parmesano.',
      precio: 160.0,
      imagen: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
      categoria: 'Entradas',
    },
    {
      id: 102,
      nombre: 'Pizza Azul',
      descripcion: 'Higos, jamón serrano y queso gorgonzola.',
      precio: 400.0,
      imagen: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',
      categoria: 'Plato Fuerte',
    },
    {
      id: 103,
      nombre: 'Exp. Tres Cocinas',
      descripcion: 'Oaxaqueña, mexicana e internacional. Basada en recetas tradicionales.',
      precio: 850.0,
      imagen: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80',
      categoria: 'Especiales',
    },
    {
      id: 104,
      nombre: 'Esferas de Cacao Nativo',
      descripcion: 'Esferas de chocolate amargo al 70% rellenas de mousse de mamey.',
      precio: 220.0,
      imagen: 'https://images.unsplash.com/photo-1639158924965-7be3bb57506b?w=500&q=80',
      categoria: 'Postres',
    },
    {
      id: 105,
      nombre: 'Clericot de Frutos Rojos',
      descripcion: 'Jarra de clericot artesanal con vino tinto y frutos frescos de la región.',
      precio: 280.0,
      imagen: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80',
      categoria: 'Bebidas',
    },
    {
      id: 106,
      nombre: 'Agua de Piedra',
      descripcion: 'Agua mineral artesanal embotellada.',
      precio: 60.0,
      imagen:
        'https://plus.unsplash.com/premium_photo-1689247946465-3ac2983ef9fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YWd1YSUyMGVuJTIwdmFzb3xlbnwwfHwwfHx8MA%3D%3D',
      categoria: 'Bebidas',
    },
  ],

  normalizarPlatillo(platillo) {
    return {
      ...platillo,
      precio: Number(platillo.precio),
      categoria: platillo.categoria?.nombre || platillo.categoria || '',
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
