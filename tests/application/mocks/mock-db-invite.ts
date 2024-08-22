import { CreateInviteRepository, LoadInviteByCodeRepository } from '@/application/protocols/db/invite'
import { CreateInviteParams, CreateInviteResult, LoadInviteByCodeParams, LoadInviteByCodeResult } from '@/domain/usecases/invite'

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
    inviteType: faker.word.sample(),
    createdAt: faker.date.past(),
    expiration: faker.date.future(),
    usedAt: null,
    maxUses: 1
  }

  async loadByCode(_params: LoadInviteByCodeParams): Promise<LoadInviteByCodeResult> {
    this.inviteCode = _params.inviteCode
    return this.result
  }
}
