import { CreateInvite, CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

export class CreateInviteSpy implements CreateInvite {
  params: CreateInviteParams
  result = {
    inviteCode: 'any_invite_code',
    status: 'any_status',
    expiration: new Date('2025-01-29T01:29:12.841Z')
  }

  async create (params: CreateInviteParams): Promise<CreateInviteResult> {
    this.params = params
    return this.result
  }
}


