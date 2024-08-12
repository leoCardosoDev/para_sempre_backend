import { CheckAccountByEmailRepositoryResult } from '@/application/types'

export interface CheckAccountByEmailRepository {
  checkByEmail: (_email: string) => Promise<CheckAccountByEmailRepositoryResult>
}
