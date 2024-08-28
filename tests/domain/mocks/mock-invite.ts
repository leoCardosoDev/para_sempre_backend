import { CreateInvite, CreateInviteParams, CreateInviteResult, LoadInviteByCode, LoadInviteByCodeParams, LoadInviteByCodeResult } from '@/domain/usecases/invite'

export class CreateInviteSpy implements CreateInvite {
  params: CreateInviteParams
  result = {
    inviteCode: 'any_invite_code',
    status: 'any_status',
    expiration: new Date('2025-01-29T01:29:12.841Z')
  }

  async create(params: CreateInviteParams): Promise<CreateInviteResult> {
    this.params = params
    return this.result
  }
}

export class LoadByCodeInviteSpy implements LoadInviteByCode {
  params: LoadInviteByCodeParams
  result = {
    accountId: 'any_account_id',
    inviteCode: 'any_invite_code',
    emailUser: 'any_email@mail.com',
    phoneUser: 'any_phone_user',
    status: 'any_status',
    expiration: new Date('2025-01-29T01:29:12.841Z')
  }

  async load(params: LoadInviteByCodeParams): Promise<LoadInviteByCodeResult> {
    this.params = params
    return this.result
  }
}
