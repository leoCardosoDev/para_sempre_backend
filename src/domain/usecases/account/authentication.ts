export interface Authentication {
  auth: (_authenticationParams: AuthenticationParams) => Promise<AuthenticationResult>
}

export type AuthenticationParams = {
  email: string
  password: string
}

export type AuthenticationResult = {
  accessToken: string
  name: string
} | null
