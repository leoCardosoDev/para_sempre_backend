import { CreateAccountParams, CreateAccountResult } from '@/domain/models'

export interface CreateAccount {
  create: (_account: CreateAccountParams) => Promise<CreateAccountResult>
}
