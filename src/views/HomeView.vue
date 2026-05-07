<template>
  <div>
    <header class="hero-section d-flex align-items-center justify-content-center text-center">
      <div class="hero-overlay"></div>
      <div class="content z-1 position-relative">
        <h1 class="display-1 text-white elegante mb-3">Sabor Azul</h1>
        <p class="text-white-50 fs-4 fw-light sub-elegante">Alta Cocina & Experiencias</p>
      </div>
    </header>

    <main class="container my-5">
      <div class="row g-5">
        <article class="col-lg-8">
          <section class="weather-menu mb-5 shadow-sm">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
              <div>
                <p class="text-uppercase text-muted fw-bold small mb-2">Recomendación por clima</p>
                <h2 class="color-primary fw-bold mb-2">
                  {{ climaMenu?.recomendaciones?.titulo || 'Menú según el clima' }}
                </h2>
                <p class="text-muted mb-0">
                  {{
                    climaMenu?.recomendaciones?.mensaje ||
                    'Consultando WeatherAPI para recomendarte algo ideal.'
                  }}
                </p>
              </div>

              <div class="weather-pill">
                <img
                  v-if="climaMenu?.icono"
                  :src="climaMenu.icono"
                  alt="Icono del clima"
                  width="42"
                  height="42"
                />
                <i v-else class="bi bi-cloud-sun-fill fs-2"></i>
                <div>
                  <strong>{{ climaMenu ? `${climaMenu.temp_c}°C` : '--°C' }}</strong>
                  <span>{{ climaMenu?.condicion || 'Cargando clima...' }}</span>
                </div>
              </div>
            </div>

            <div v-if="errorClima" class="alert alert-warning py-2 small">
              {{ errorClima }}
            </div>

            <div class="row g-3">
              <div
                v-for="item in recomendacionesClima"
                :key="item.id"
                class="col-md-4"
              >
                <div class="weather-card h-100">
                  <img :src="item.imagen" :alt="item.nombre" />
                  <div class="p-3">
                    <h3 class="h6 fw-bold color-primary mb-1">{{ item.nombre }}</h3>
                    <p class="text-muted small mb-3">{{ item.descripcion }}</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <strong class="text-success">${{ item.precio.toFixed(2) }}</strong>
                      <button
                        class="btn btn-sm btn-dark rounded-circle"
                        @click="agregarAlCarritoGlobal(item.id, item.nombre, item.precio, item.imagen)"
                        title="Agregar al carrito"
                      >
                        <i class="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="route-map mb-5 shadow-sm">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
              <div>
                <p class="text-uppercase text-muted fw-bold small mb-2">Mapa interactivo</p>
                <h2 class="color-primary fw-bold mb-2">Ruta real hasta Sabor Azul</h2>
                <p class="text-muted mb-0">
                  Obtén tu ubicación, traza la ruta por calles y descubre parques o museos cercanos.
                </p>
              </div>
              <button
                class="btn btn-dark rounded-pill px-4 align-self-md-start"
                @click="calcularRutaYLugares"
                :disabled="cargandoRuta"
              >
                {{ cargandoRuta ? 'Calculando...' : 'Cómo llegar' }}
              </button>
            </div>

            <div v-if="errorMapa" class="alert alert-warning py-2 small">
              {{ errorMapa }}
            </div>

            <div ref="mapaContenedor" class="map-container"></div>

            <div v-if="rutaMapa" class="route-summary mt-3">
              <span><strong>{{ rutaMapa.distancia_km }} km</strong> hasta el restaurante</span>
              <span>{{ rutaMapa.duracion_min }} min aprox. en auto</span>
            </div>

            <div v-if="lugaresCercanos.length" class="mt-3">
              <h3 class="h6 fw-bold color-primary mb-2">Lugares cercanos encontrados</h3>
              <div class="vstack gap-2">
                <div v-for="lugar in lugaresCercanos" :key="lugar.place_id" class="nearby-place">
                  <i class="bi bi-pin-map-fill text-danger"></i>
                  <div>
                    <strong>{{ lugar.nombre }}</strong>
                    <span>{{ lugar.direccion || 'Dirección no disponible' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <h2 class="color-primary fw-bold mb-4">Nuestros Especiales</h2>

          <div class="table-responsive mb-5 shadow-sm rounded">
            <table class="table table-hover table-bordered mb-0 align-middle">
              <caption class="caption-top px-3 fw-bold color-primary">
                Selección de Temporada
              </caption>
              <thead class="table-light">
                <tr>
                  <th>Categoría</th>
                  <th>Platillo</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowspan="2" class="bg-light fw-bold text-center">Especiales del Mar</td>
                  <td class="fw-semibold">Salmón al Grill</td>
                  <td class="text-muted">Corte fino con costra de finas hierbas.</td>
                  <td class="fw-bold text-success">$350.00</td>
                </tr>
                <tr>
                  <td class="fw-semibold">Ceviche Sabor Azul</td>
                  <td class="text-muted">Camarón macerado en cítricos.</td>
                  <td class="fw-bold text-success">$280.00</td>
                </tr>
                <tr>
                  <td rowspan="2" class="bg-light fw-bold text-center">Cortes Premium</td>
                  <td class="fw-semibold">Ribeye Añejo</td>
                  <td class="text-muted">A la parrilla con salsa de vino tinto.</td>
                  <td class="fw-bold text-success">$750.00</td>
                </tr>
                <tr>
                  <td class="fw-semibold">Filete Mignon</td>
                  <td class="text-muted">Bañado en salsa de champiñones.</td>
                  <td class="fw-bold text-success">$680.00</td>
                </tr>
              </tbody>
              <tfoot class="table-secondary">
                <tr>
                  <td colspan="3">
                    <strong>Promoción:</strong> Copa de vino gratis en consumos mayores a $1,000 MXN
                  </td>
                  <td>
                    <a
                      href="#"
                      class="text-decoration-none fw-bold color-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#modalTerminos"
                      style="cursor: pointer"
                      >Ver términos</a
                    >
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="card mb-4 border-0 shadow-sm food-card">
            <div class="row g-0">
              <div class="col-md-5">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"
                  class="img-fluid rounded-start object-fit-cover w-100 h-100"
                  alt="Ensalada"
                />
              </div>
              <div class="col-md-7 d-flex align-items-center">
                <div class="card-body">
                  <h4 class="card-title color-primary fw-bold">Ensalada César</h4>
                  <p class="card-text text-muted">
                    Lechuga orejona, aderezo artesanal y parmesano.
                  </p>
                  <button
                    class="btn btn-custom w-100 fw-bold"
                    @click="
                      agregarAlCarritoGlobal(
                        101,
                        'Ensalada César',
                        160.0,
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80',
                      )
                    "
                  >
                    Ordenar $160.00
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-4 border-0 shadow-sm food-card">
            <div class="row g-0">
              <div class="col-md-5">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80"
                  class="img-fluid rounded-start object-fit-cover w-100 h-100"
                  alt="Pizza"
                />
              </div>
              <div class="col-md-7 d-flex align-items-center">
                <div class="card-body">
                  <h4 class="card-title color-primary fw-bold">Pizza Azul</h4>
                  <p class="card-text text-muted">Higos y queso gorgonzola.</p>
                  <button
                    class="btn btn-custom w-100 fw-bold"
                    @click="
                      agregarAlCarritoGlobal(
                        102,
                        'Pizza Azul',
                        400.0,
                        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&q=80',
                      )
                    "
                  >
                    Ordenar $400.00
                  </button>
                </div>
              </div>
            </div>
          </div>
          <h3 class="color-primary fw-bold mt-5 pt-4 border-top border-2 mb-4">
            Experiencias del Chef
          </h3>

          <div class="row align-items-center mb-5 pb-4 scroll-animado">
            <div class="col-md-7">
              <div class="img-container rounded shadow-sm overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80"
                  alt="Tr3s Cocinas"
                  class="img-fluid w-100 object-fit-cover zoom-img"
                  style="height: 400px"
                />
              </div>
            </div>
            <div class="col-md-5">
              <div class="card border-0 shadow-lg p-4 p-xl-5 tarjeta-superpuesta-derecha">
                <h4 class="fw-bold color-primary mb-3 text-italic">
                  tres cocinas: oaxaqueña, mexicana e internacional
                </h4>
                <p class="text-muted small mb-4">
                  El común denominador de esta diversidad de orígenes en nuestros platos es una
                  cocina basada en recetas sencillas, muy bien logradas, utilizando siempre
                  ingredientes auténticos en apego a la tradición.
                </p>
                <button
                  class="btn btn-dark fw-bold px-4 py-2 text-uppercase text-tracking"
                  @click="
                    agregarAlCarritoGlobal(
                      103,
                      'Exp. Tres Cocinas',
                      850.0,
                      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=100&q=80',
                    )
                  "
                >
                  Ordenar Experiencia - $850.00
                </button>
              </div>
            </div>
          </div>

          <div class="row align-items-center mb-5 pb-4 scroll-animado">
            <div class="col-md-5 order-2 order-md-1 mt-4 mt-md-0">
              <div class="card border-0 shadow-lg p-4 p-xl-5 tarjeta-superpuesta-izquierda">
                <h4 class="fw-bold color-primary mb-3 text-italic">Dulce Final: Cacao Nativo</h4>
                <p class="text-muted small mb-4">
                  Una reinterpretación del clásico oaxaqueño. Esferas de chocolate amargo al 70%
                  rellenas de mousse de mamey, montadas sobre tierra de pinole y bañadas en la mesa
                  con una infusión caliente de canela y vainilla silvestre.
                </p>
                <button
                  class="btn btn-dark fw-bold px-4 py-2 text-uppercase text-tracking"
                  @click="
                    agregarAlCarritoGlobal(
                      104,
                      'Esferas de Cacao',
                      220.0,
                      'https://images.unsplash.com/photo-1639158924965-7be3bb57506b?w=100&q=80',
                    )
                  "
                >
                  Agregar Postre - $220.00
                </button>
              </div>
            </div>
            <div class="col-md-7 order-1 order-md-2">
              <div class="img-container rounded shadow-sm overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1639158924965-7be3bb57506b?w=800&q=80"
                  alt="Postre Cacao Nativo"
                  class="img-fluid w-100 object-fit-cover zoom-img"
                  style="height: 400px"
                />
              </div>
            </div>
          </div>
        </article>

        <aside class="col-lg-4">
          <div class="sticky-top" style="top: 100px">
            <h3 class="color-primary fw-bold mb-3 fs-4">Ofertas del Día</h3>
            <div class="card border-0 shadow-sm mb-3">
              <div class="card-body">
                <h4 class="color-primary fw-bold fs-5">2x1</h4>
                <p class="card-text text-muted mb-0">En coctelería de 6pm a 8pm.</p>
              </div>
            </div>
            <div class="card border-0 shadow-sm mb-4 text-white" style="background-color: #1a365d">
              <div class="card-body">
                <h4 class="fw-bold fs-5">¡Postre Gratis!</h4>
                <p class="card-text mb-1">En consumos mayores a $500 MXN.</p>
                <small class="opacity-75">*Solo hoy</small>
              </div>
            </div>
            <div class="card border-0 shadow-sm mb-4" style="background-color: #f8fafc">
              <div class="card-body">
                <h4 class="color-primary fw-bold mb-3 fs-5">Club VIP</h4>
                <input
                  type="email"
                  v-model="emailVIP"
                  class="form-control mb-2"
                  placeholder="Tu correo..."
                />
                <div v-if="errorVIP" class="text-danger small mb-3 fw-bold">
                  Por favor, ingresa un correo válido.
                </div>
                <button
                  class="btn text-white w-100 fw-bold py-2"
                  style="background-color: #e74c3c"
                  @click="suscribirVIP"
                >
                  Suscribirse
                </button>
              </div>
            </div>
            <div class="card border-0 shadow-sm mb-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3814.0722338271576!2d-96.72778768513568!3d17.06263528827453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c722384666f27b%3A0xe54e1951f28cb61f!2sZ%C3%B3calo%20Oaxaca!5e0!3m2!1ses!2smx!4v1680000000000!5m2!1ses!2smx"
                width="100%"
                height="200"
                style="border: 0; border-radius: 8px 8px 0 0"
                allowfullscreen=""
                loading="lazy"
              ></iframe>
              <div class="card-body">
                <h4 class="color-primary fw-bold mb-3 fs-5">
                  <i class="bi bi-geo-alt-fill me-2 text-danger"></i>Encuéntranos
                </h4>
                <p class="text-muted small mb-2">
                  Portal de Flores #3, Centro Histórico<br />Oaxaca de Juárez, Oax. C.P. 68000
                </p>
                <hr class="opacity-25 my-2" />
                <p class="text-muted small mb-0 fw-bold">
                  <i class="bi bi-clock me-1"></i> Abierto hoy: 11:00 AM - 09:00 PM
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <div class="modal fade" id="modalTerminos" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg modal-term-style">
          <div class="modal-header bg-light border-bottom">
            <h5 class="modal-title fw-bold color-primary">
              <i class="bi bi-info-circle me-2"></i>Términos y Condiciones
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body p-4 text-muted small">
            <p><strong>1. Vigencia:</strong> Promoción válida durante el mes en curso.</p>
            <p>
              <strong>2. Aplicación:</strong> Copa de vino gratis por ticket de consumo >= $1,000.00
              MXN.
            </p>
          </div>
          <div class="modal-footer border-top-0 justify-content-center">
            <button type="button" class="btn btn-custom fw-bold px-4" data-bs-dismiss="modal">
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="modalExitoVIP" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow text-center p-4">
          <div class="mb-3">
            <i class="bi bi-check-circle-fill text-success" style="font-size: 3.5rem"></i>
          </div>
          <h5 class="fw-bold color-primary">¡Suscripción exitosa!</h5>
          <p class="text-muted small mb-4">Pronto recibirás nuestras promociones.</p>
          <button type="button" class="btn btn-custom fw-bold w-100" data-bs-dismiss="modal">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { buildApiUrl } from '../config/api'
import { estadoCarrito } from '../store/carrito'

const agregarAlCarritoGlobal = (id, nombre, precio, imagen) => {
  estadoCarrito.agregar({ id, nombre, precio, imagen })
}

const emailVIP = ref('')
const errorVIP = ref(false)
const climaMenu = ref(null)
const errorClima = ref('')
const recomendacionesClima = computed(() => climaMenu.value?.recomendaciones?.items || [])
const mapaContenedor = ref(null)
const mapaGoogle = ref(null)
const rutaPolyline = ref(null)
const marcadoresMapa = ref([])
const rutaMapa = ref(null)
const lugaresCercanos = ref([])
const cargandoRuta = ref(false)
const errorMapa = ref('')
const restauranteCoords = { lat: 17.062635, lng: -96.727788 }

const cargarClimaMenu = async () => {
  errorClima.value = ''

  try {
    const respuesta = await fetch(buildApiUrl('/clima-menu'))
    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.error || 'No se pudo consultar el clima')
    }

    climaMenu.value = datos
  } catch (error) {
    console.error('No se pudo cargar el clima:', error)
    errorClima.value = 'No se pudo consultar el clima. Mostrando recomendaciones generales.'
    climaMenu.value = {
      temp_c: 24,
      condicion: 'Templado',
      recomendaciones: {
        titulo: 'Clima agradable en Oaxaca',
        mensaje: 'El día está ideal para especiales de la casa y experiencias del chef.',
        items: [
          {
            id: 103,
            nombre: 'Exp. Tres Cocinas',
            descripcion: 'Oaxaqueña, mexicana e internacional en una experiencia.',
            precio: 850,
            imagen: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300&q=80',
          },
          {
            id: 102,
            nombre: 'Pizza Azul',
            descripcion: 'Higos, jamón serrano y queso gorgonzola.',
            precio: 400,
            imagen: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80',
          },
          {
            id: 104,
            nombre: 'Esferas de Cacao',
            descripcion: 'Postre de cacao nativo con mousse de mamey.',
            precio: 220,
            imagen: 'https://images.unsplash.com/photo-1639158924965-7be3bb57506b?w=300&q=80',
          },
        ],
      },
    }
  }
}

const suscribirVIP = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegex.test(emailVIP.value)) {
    errorVIP.value = false
    const modal = new window.bootstrap.Modal(document.getElementById('modalExitoVIP'))
    modal.show()
    emailVIP.value = ''
  } else {
    errorVIP.value = true
  }
}

const cargarGoogleMapsSdk = async () => {
  if (window.google?.maps) return
  if (window.__saborAzulMapsPromise) return window.__saborAzulMapsPromise

  window.__saborAzulMapsPromise = new Promise(async (resolve, reject) => {
    try {
      const respuesta = await fetch(buildApiUrl('/maps-config'))
      const datos = await respuesta.json()

      if (!respuesta.ok || !datos.apiKey) {
        throw new Error(datos.error || 'No se pudo cargar Google Maps')
      }

      window.__saborAzulMapsReady = resolve
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${datos.apiKey}&libraries=places&callback=__saborAzulMapsReady`
      script.async = true
      script.defer = true
      script.onerror = () => reject(new Error('No se pudo cargar el SDK de Google Maps'))
      document.head.appendChild(script)
    } catch (error) {
      reject(error)
    }
  })

  return window.__saborAzulMapsPromise
}

const agregarMarcadorMapa = (position, title, label) => {
  const marker = new window.google.maps.Marker({
    map: mapaGoogle.value,
    position,
    title,
    label,
  })
  marcadoresMapa.value.push(marker)
  return marker
}

const limpiarRutaMapa = () => {
  if (rutaPolyline.value) {
    rutaPolyline.value.setMap(null)
    rutaPolyline.value = null
  }

  marcadoresMapa.value.forEach((marker) => marker.setMap(null))
  marcadoresMapa.value = []
  lugaresCercanos.value = []
  rutaMapa.value = null
}

const inicializarMapa = async () => {
  try {
    await cargarGoogleMapsSdk()

    if (!mapaContenedor.value || mapaGoogle.value) return

    mapaGoogle.value = new window.google.maps.Map(mapaContenedor.value, {
      center: restauranteCoords,
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    })

    agregarMarcadorMapa(restauranteCoords, 'Sabor Azul', 'R')
  } catch (error) {
    console.error('No se pudo iniciar Google Maps:', error)
    errorMapa.value = error.message || 'No se pudo cargar Google Maps'
  }
}

const obtenerUbicacionActual = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Tu navegador no permite geolocalización'))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 60000,
    })
  })
}

const calcularRutaYLugares = async () => {
  cargandoRuta.value = true
  errorMapa.value = ''

  try {
    await inicializarMapa()
    if (!mapaGoogle.value) throw new Error('El mapa todavía no está disponible')

    const posicion = await obtenerUbicacionActual()
    const origen = {
      lat: posicion.coords.latitude,
      lng: posicion.coords.longitude,
    }

    const respuesta = await fetch(buildApiUrl('/ruta-y-lugares'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(origen),
    })
    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.error || 'No se pudo calcular la ruta')
    }

    limpiarRutaMapa()
    agregarMarcadorMapa(origen, 'Tu ubicación', 'U')
    agregarMarcadorMapa(datos.destino, 'Sabor Azul', 'R')

    rutaPolyline.value = new window.google.maps.Polyline({
      map: mapaGoogle.value,
      path: datos.ruta.polyline,
      geodesic: true,
      strokeColor: '#2563eb',
      strokeOpacity: 0.95,
      strokeWeight: 5,
    })

    const bounds = new window.google.maps.LatLngBounds()
    datos.ruta.polyline.forEach((point) => bounds.extend(point))

    lugaresCercanos.value = datos.lugares || []
    lugaresCercanos.value.forEach((lugar, index) => {
      const position = { lat: lugar.lat, lng: lugar.lng }
      agregarMarcadorMapa(position, lugar.nombre, String(index + 1))
      bounds.extend(position)
    })

    mapaGoogle.value.fitBounds(bounds)
    rutaMapa.value = datos.ruta
  } catch (error) {
    console.error('No se pudo calcular la ruta:', error)
    errorMapa.value =
      error.code === 1
        ? 'Necesitas permitir el acceso a tu ubicación para trazar la ruta.'
        : error.message || 'No se pudo calcular la ruta.'
  } finally {
    cargandoRuta.value = false
  }
}

onMounted(() => {
  cargarClimaMenu()
  inicializarMapa()

  const elementosAnimados = document.querySelectorAll('.scroll-animado')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scrolled-in')
        } else {
          entry.target.classList.remove('scrolled-in')
        }
      })
    },
    { threshold: 0.15 },
  )
  elementosAnimados.forEach((el) => observer.observe(el))
})
</script>

<style scoped>
.hero-section {
  height: 100vh;
  width: 100%;
  background-image: url('https://png.pngtree.com/background/20250105/original/pngtree-light-blue-velvet-background-dark-texture-with-a-gradient-picture-image_15759173.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
}
.elegante {
  font-family: 'Times New Roman', serif;
  font-style: italic;
  letter-spacing: 4px;
  animation: aparecerTexto 2s ease-out forwards;
}
.sub-elegante {
  letter-spacing: 3px;
  opacity: 0;
  animation: aparecerTexto 2s ease-out 0.5s forwards;
}
@keyframes aparecerTexto {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* CLASES DE UTILIDAD GENERALES */
.color-primary {
  color: #1a365d;
}
.text-italic {
  font-family: 'Times New Roman', serif;
  font-style: italic;
}
.text-tracking {
  letter-spacing: 1px;
  font-size: 0.8rem;
}
.btn-custom {
  background-color: #1a365d;
  color: white;
  border-radius: 50rem;
  transition: background 0.3s;
}
.btn-custom:hover {
  background-color: #0f172a;
  color: white;
}
.food-card:hover {
  transform: scale(1.02);
  transition: transform 0.3s;
}

.weather-menu {
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 8px;
  padding: 1.25rem;
}

.weather-pill {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 170px;
  background: #e8f0f8;
  color: #1a365d;
  border-radius: 8px;
  padding: 0.75rem 1rem;
}

.weather-pill strong,
.weather-pill span {
  display: block;
  line-height: 1.1;
}

.weather-pill span {
  color: #64748b;
  font-size: 0.85rem;
  margin-top: 0.15rem;
}

.weather-card {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 8px;
  background: #f8fafc;
  overflow: hidden;
}

.weather-card img {
  width: 100%;
  height: 130px;
  object-fit: cover;
}

.route-map {
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 8px;
  padding: 1.25rem;
}

.map-container {
  width: 100%;
  min-height: 360px;
  border-radius: 8px;
  overflow: hidden;
  background: #e5e7eb;
}

.route-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  color: #1a365d;
}

.route-summary span {
  background: #e8f0f8;
  border-radius: 999px;
  padding: 0.45rem 0.8rem;
}

.nearby-place {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #f8fafc;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 8px;
  padding: 0.8rem;
}

.nearby-place span {
  display: block;
  color: #64748b;
  font-size: 0.85rem;
}

.platillo-destacado-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  overflow: visible;
}

.img-zoom-container {
  width: 60%;
  overflow: hidden;
  border-radius: 8px;
}

.img-zoom-container img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.platillo-destacado-wrapper:hover .img-zoom-container img {
  transform: scale(1.1);
}

.tarjeta-superpuesta {
  width: 50%;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  position: absolute;
  right: 0;
  z-index: 1;
}

@media (min-lg-width: 992px) {
  .order-lg-2 {
    order: 2;
    right: 0;
    left: auto;
  }
  .order-lg-1 {
    order: 1;
    left: 0;
    right: auto;
    margin-left: 0;
    margin-right: -10%;
  }
}
.style-postre-text {
  left: 0 !important;
  right: auto !important;
  margin-right: -10% !important;
}

.scroll-animado {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}
.scroll-animado.scrolled-in {
  opacity: 1;
  transform: translateY(0);
}

.modal-term-style {
  border-radius: 8px;
}
</style>
