import { LoadAccountByTokenResult } from '@/domain/types'

export interface LoadAccountByToken {
  load: (_accessToken: string, _role?: string) => Promise<LoadAccountByTokenResult>
}
