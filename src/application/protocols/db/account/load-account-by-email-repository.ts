export interface LoadAccountByEmailRepository {
  loadByEmail: (_email: string) => Promise<LoadAccountByEmailRepositoryResult>
}

export type LoadAccountByEmailRepositoryResult = {
  id: string
  name: string
  password: string
} | null
