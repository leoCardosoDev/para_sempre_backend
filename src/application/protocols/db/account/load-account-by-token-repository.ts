import { LoadAccountByTokenRepositoryResult } from '@/application/types'

export interface LoadAccountByTokenRepository {
  loadByToken: (_token: string, _role?: string) => Promise<LoadAccountByTokenRepositoryResult>
}
