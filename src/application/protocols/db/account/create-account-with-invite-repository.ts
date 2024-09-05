import { CreateAccountWithInviteParams, CreateAccountWithInviteResult } from '@/domain/usecases/account/create-account-with-invite'

export interface CreateAccountWithInviteRepository {
  create: (_data: CreateAccountWithInviteRepositoryParams) => Promise<CreateAccountWithInviteRepositoryResult>
}

export type CreateAccountWithInviteRepositoryParams = CreateAccountWithInviteParams

export type CreateAccountWithInviteRepositoryResult = CreateAccountWithInviteResult
