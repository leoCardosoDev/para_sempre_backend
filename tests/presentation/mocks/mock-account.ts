import { Authentication, LoadAccountByToken, AuthenticationParams, AuthenticationResult, LoadAccountByTokenResult } from '@/domain/usecases'

import { faker } from '@faker-js/faker'

export class AuthenticationSpy implements Authentication {
  params: AuthenticationParams
  result = {
    accessToken: faker.string.uuid(),
    name: faker.person.fullName()
  }

  async auth(params: AuthenticationParams): Promise<AuthenticationResult> {
    this.params = params
    return this.result
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accessToken: string
  role?: string
  result: { id: string } | null = {
    id: faker.string.uuid()
  }

  async load(accessToken: string, role?: string): Promise<LoadAccountByTokenResult> {
    this.accessToken = accessToken
    this.role = role
    return this.result ?? null
  }
}
