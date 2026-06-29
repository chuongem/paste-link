export type User = {
  id: number
  name: string
  email: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = LoginPayload & {
  name: string
  password_confirmation: string
}

export type AuthTokenResponse = {
  success: boolean
  message: string
  data: {
    user: User
    access_token: string
    token_type: 'Bearer' | string
  }
}

export type UserResponse = {
  success: boolean
  message: string
  data: User
}
