import { CreateInviteRepository, InviteCodeGenerator, LoadInviteByCodeRepository, LoadInviteByCodeRepositoryResult } from '@/application/protocols/db/invite'
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

export class LoadInviteByCodeRepositorySpy implements LoadInviteByCodeRepository {
  inviteCode: string = ''
  inviteId: string = 'last_invite_id'
  result: LoadInviteByCodeRepositoryResult = null

  async loadByCode(inviteCode: string): Promise<LoadInviteByCodeRepositoryResult> {
    this.inviteCode = inviteCode

    // Aqui usamos spread operator para garantir que as propriedades sejam mescladas corretamente
    return this.result ? { ...this.result, inviteId: this.inviteId } : null
  }
}
