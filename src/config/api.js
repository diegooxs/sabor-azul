const getDefaultApiUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000/api'
    }
  }

  return 'https://backend-sabor-azul.onrender.com/api'
}

const rawApiUrl = import.meta.env.VITE_API_URL || getDefaultApiUrl()

export const API_BASE_URL = rawApiUrl.replace(/\/+$/, '')

export const buildApiUrl = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}
