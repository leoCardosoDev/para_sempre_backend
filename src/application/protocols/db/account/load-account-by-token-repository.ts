export interface LoadAccountByTokenRepository {
  loadByToken: (_token: string, _role?: string) => Promise<LoadAccountByTokenRepositoryResult>
}

export type LoadAccountByTokenRepositoryResult = { id: string } | null
