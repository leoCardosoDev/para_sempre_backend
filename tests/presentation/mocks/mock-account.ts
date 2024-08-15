import { AuthenticationParams, AuthenticationResult, CreateAccountParams, CreateAccountResult, LoadAccountByTokenResult } from '@/domain/types'
import { CreateAccount, Authentication, LoadAccountByToken } from '@/domain/usecases'

import { faker } from '@faker-js/faker'

export class CreateAccountSpy implements CreateAccount {
  params: CreateAccountParams
  result = true

  async create (params: CreateAccountParams): Promise<CreateAccountResult> {
    this.params = params
    return this.result
  }
}

export class AuthenticationSpy implements Authentication {
  params: AuthenticationParams
  result = {
    accessToken: faker.string.uuid(),
    name: faker.person.fullName()
  }

  async auth (params: AuthenticationParams): Promise<AuthenticationResult> {
    this.params = params
    return this.result
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accessToken: string
  role?: string
  result: {id: string } | null = {
    id: faker.string.uuid()
  }

  async load (accessToken: string, role?: string): Promise<LoadAccountByTokenResult> {
    this.accessToken = accessToken
    this.role = role
    return this.result ?? null
  }
}
