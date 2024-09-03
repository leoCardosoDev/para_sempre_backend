import { CreateInvite, CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

export class CreateInviteSpy implements CreateInvite {
  params: CreateInviteParams
  result = {
    inviteId: 'last_invite_id',
    accountId: 'any_account_id',
    inviteCode: 'any_invite_code',
    emailUser: 'any_email_user@mail.com',
    phoneUser: 'any_phone_user',
    inviteType: 'any_invite_type',
    status: 'any_status',
    usedAt: null,
    createdAt: new Date(),
    expiration: new Date('2025-01-29T01:29:12.841Z'),
    maxUses: 1
  }

  async create(params: CreateInviteParams): Promise<CreateInviteResult> {
    this.params = params
    return this.result
  }
}
