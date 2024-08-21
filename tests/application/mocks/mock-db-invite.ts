import { CreateInviteRepository } from '@/application/protocols/db/invite'
import { CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

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
