import { AuthenticationParams, AuthenticationResult } from '@/domain/types'

export interface Authentication {
  auth: (_authenticationParams: AuthenticationParams) => Promise<AuthenticationResult>
}
