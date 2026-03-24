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
import { ref, onMounted } from 'vue'
import { estadoCarrito } from '../store/carrito'

const agregarAlCarritoGlobal = (id, nombre, precio, imagen) => {
  estadoCarrito.agregar({ id, nombre, precio, imagen })
}

const emailVIP = ref('')
const errorVIP = ref(false)
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

onMounted(() => {
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

/* Ajustes específicos para el segundo bloque (Postre) para asimetría inversa */
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
