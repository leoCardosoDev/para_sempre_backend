import { CreateInviteRepository, InviteCodeGenerator } from '@/application/protocols/db/invite'
import { CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

export class CreateInviteRepositorySpy implements CreateInviteRepository {
  inviteData: CreateInviteParams | null = null

  async createInvite(_invateData: CreateInviteParams): Promise<CreateInviteResult> {
    this.inviteData = _invateData
    const result = {
      inviteId: 'last_invite_id',
      inviteCode: _invateData.inviteCode,
      status: _invateData.status,
      emailUser: _invateData.emailUser,
      usedAt: _invateData.usedAt,
      expiration: _invateData.expiration
    }
    return new Promise(resolve => resolve(result))
  }
}

export class InviteCodeGeneratorSpy implements InviteCodeGenerator {
  generate = jest.fn().mockResolvedValue('unique_invite_code')
}
