import { LoadAccountByEmailRepositoryResult } from '@/application/types'

export interface LoadAccountByEmailRepository {
  loadByEmail: (_email: string) => Promise<LoadAccountByEmailRepositoryResult>
}
