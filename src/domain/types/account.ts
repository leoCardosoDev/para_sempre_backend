export type CreateAccountParams = {
  name: string
  email: string
  password: string
}

export type CreateAccountResult = boolean

export type AuthenticationParams = {
  email: string
  password: string
}

export type AuthenticationResult = {
  accessToken: string
  name: string
} | null

export type LoadAccountByTokenResult = {
  id: string
} | null
