
export interface LoginRequestBody {
  credential: string // email || username
  password: string
}

export interface LoginSigninResponse {
  username: string
  email: string
  image: string
}

export interface SigninRequestBody {
  username: string
  email: string
  password: string
}

export interface ChangeCredentialsRequestBody {
  username?: string
  email?: string
  password?: {
    new: string
    old: string
  }
}
