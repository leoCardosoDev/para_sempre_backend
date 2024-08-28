export interface CheckAccountByEmailRepository {
  checkByEmail: (_email: string) => Promise<CheckAccountByEmailRepositoryResult>
}

export type CheckAccountByEmailRepositoryResult = boolean
