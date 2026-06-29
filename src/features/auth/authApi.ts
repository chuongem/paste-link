import { apiClient } from '../../api/client'
import type { AuthTokenResponse, LoginPayload, RegisterPayload, UserResponse } from './types'

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<AuthTokenResponse>('/auth/login', payload)
  return response.data
}

export async function register(payload: RegisterPayload) {
  const response = await apiClient.post<AuthTokenResponse>('/auth/register', payload)
  return response.data
}

export async function logout() {
  await apiClient.post('/auth/logout')
}

export async function getMe() {
  const response = await apiClient.get<UserResponse>('/me')
  return response.data.data
}
