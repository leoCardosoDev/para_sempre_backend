export interface CheckEmailRepository {
  checkByEmail: (_email: string) => Promise<CheckEmailRepositoryResult>
}

export type CheckEmailRepositoryResult = boolean
