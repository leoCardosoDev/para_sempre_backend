import { CreateAccountParams, CreateAccountResult } from '@/domain/types'

export interface CreateAccount {
  create: (_account: CreateAccountParams) => Promise<CreateAccountResult>
}
