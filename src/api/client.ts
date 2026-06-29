import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://paste-link-core.onrender.com/api/v1'

export const APP_URL = import.meta.env.VITE_APP_URL ?? window.location.origin

export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'PasteLink'

export const OPENAPI_URL =
  import.meta.env.VITE_OPENAPI_URL ?? 'https://paste-link-core.onrender.com/docs?api-docs.json'

export const AUTH_TOKEN_STORAGE_KEY = 'paste-link.access-token'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)

  // Attach the bearer token to every API request after the user logs in.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    return typeof message === 'string' ? message : error.message
  }

  return 'Something went wrong. Please try again.'
}
