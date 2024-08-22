import { CreateInviteRepository, LoadInviteByCodeRepository, LoadInviteByCodeRepositoryResult } from '@/application/protocols/db/invite'
import { CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

import { faker } from '@faker-js/faker'

export class CreateInviteRepositorySpy implements CreateInviteRepository {
  async create (_invateData: CreateInviteParams): Promise<CreateInviteResult> {
    const result = {
      inviteCode: _invateData.inviteCode,
      status: _invateData.status,
      expiration: _invateData.expiration
    }
    return new Promise(resolve => resolve(result))
  }
}

export class LoadInviteByCodeRepositorySpy implements LoadInviteByCodeRepository {
  inviteCode: string
  result = {
    accountId: faker.string.uuid(),
    inviteCode: faker.string.uuid(),
    emailUser: faker.internet.email(),
    phoneUser: faker.string.uuid(),
    status: faker.word.sample(),
    expiration: faker.date.future(),
  }

  async loadByCode(inviteCode: string): Promise<LoadInviteByCodeRepositoryResult> {
    this.inviteCode = inviteCode
    return this.result
  }
}
