import { CreateAccountParams } from '@/domain/types'

export type CreateAccountRepositoryParams = CreateAccountParams
export type CreateAccountRepositoryResult = boolean
export type CheckAccountByEmailRepositoryResult = boolean
export type LoadAccountByEmailRepositoryResult = {
  id: string
  name: string
  password: string
} | null
export type LoadAccountByTokenRepositoryResult = { id: string }
