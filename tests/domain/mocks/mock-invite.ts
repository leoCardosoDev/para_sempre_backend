import { CreateInvite, CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

export class CreateInviteSpy implements CreateInvite {
  params: CreateInviteParams
  result = {
    inviteId: 'last_invite_id',
    inviteCode: 'any_invite_code',
    emailUser: 'any_email_user',
    usedAt: null,
    status: 'any_status',
    expiration: new Date('2025-01-29T01:29:12.841Z')
  }

  async create(params: CreateInviteParams): Promise<CreateInviteResult> {
    this.params = params
    return this.result
  }
}
