import { CreateAccountParams } from '@/domain/usecases'

export interface CreateAccountRepository {
  create: (_data: CreateAccountRepositoryParams) => Promise<CreateAccountRepositoryResult>
}

export type CreateAccountRepositoryParams = CreateAccountParams
export type CreateAccountRepositoryResult = boolean
