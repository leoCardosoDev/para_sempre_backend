import { CreateInviteRepository, InviteCodeGenerator, LoadInviteByCodeRepository, LoadInviteByCodeRepositoryResult } from '@/application/protocols/db/invite'
import { CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

export class CreateInviteRepositorySpy implements CreateInviteRepository {
  inviteData: CreateInviteParams | null = null

  async createInvite(_invateData: CreateInviteParams): Promise<CreateInviteResult> {
    this.inviteData = _invateData
    const result = {
      inviteId: 'last_invite_id',
      accountId: _invateData.accountId,
      inviteCode: _invateData.inviteCode,
      phoneUser: _invateData.phoneUser,
      status: _invateData.status,
      emailUser: _invateData.emailUser,
      usedAt: _invateData.usedAt,
      expiration: _invateData.expiration,
      inviteType: _invateData.inviteType,
      createdAt: _invateData.createdAt,
      maxUses: _invateData.maxUses
    }
    return new Promise(resolve => resolve(result))
  }
}

export class InviteCodeGeneratorSpy implements InviteCodeGenerator {
  generate = jest.fn().mockResolvedValue('unique_invite_code')
}

export class LoadInviteByCodeRepositorySpy implements LoadInviteByCodeRepository {
  inviteCode: string = ''
  inviteId: string = 'last_invite_id'
  result: LoadInviteByCodeRepositoryResult = null

  async loadByCode(inviteCode: string): Promise<LoadInviteByCodeRepositoryResult> {
    this.inviteCode = inviteCode
    return this.result ? { ...this.result, inviteId: this.inviteId } : null
  }
}
