import {
  CreateAccountWithInviteRepository,
  CreateAccountWithInviteRepositoryParams,
  CreateAccountWithInviteRepositoryResult,
  LoadAccountByEmailRepository,
  LoadAccountByEmailRepositoryResult,
  LoadAccountByTokenRepository,
  LoadAccountByTokenRepositoryResult,
  UpdateAccessTokenRepository
} from '@/application/protocols'

import { faker } from '@faker-js/faker'

export class CreateAccountWithInviteRepositorySpy implements CreateAccountWithInviteRepository {
  params: CreateAccountWithInviteRepositoryParams
  result = {
    success: true,
    inviteId: faker.string.uuid(),
    error: undefined
  }

  async create(data: CreateAccountWithInviteRepositoryParams): Promise<CreateAccountWithInviteRepositoryResult> {
    this.params = data
    return this.result
  }
}
export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  email: string
  result: { id: string; name: string; password: string } | null = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    password: faker.internet.password()
  }

  async loadByEmail(email: string): Promise<LoadAccountByEmailRepositoryResult> {
    this.email = email
    return this.result
  }
}
export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  token: string
  role: string
  result = {
    id: faker.string.uuid()
  }

  async loadByToken(token: string, role?: string): Promise<LoadAccountByTokenRepositoryResult> {
    this.token = token
    this.role = role ?? ''
    return this.result
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken(id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
  }
}
