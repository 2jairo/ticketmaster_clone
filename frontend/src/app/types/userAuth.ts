
export interface LoginRequestBody {
  credential: string // email || username
  password: string
}

export type UserRole = 'ADMIN' | 'CLIENT' | 'ROOT'
export const USER_ROLES = ['ADMIN', 'CLIENT', 'ROOT']

export interface LoginSigninResponse {
  username: string
  email: string
  image: string
  role: UserRole
}

export interface SigninRequestBody {
  username: string
  email: string
  password: string
}

export interface ChangeCredentialsRequestBody {
  username?: string
  email?: string
  image?: string
}

export interface ChangePasswordRequestBody {
  new: string
  old: string
}

export interface JwtClaims {
  userId: string
  v: number
  role: UserRole
}
