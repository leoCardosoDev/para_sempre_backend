import { CreateAccountRepositoryParams, CreateAccountRepositoryResult } from '@/application/types'

export interface CreateAccountRepository {
  create: (_data: CreateAccountRepositoryParams) => Promise<CreateAccountRepositoryResult>
}
