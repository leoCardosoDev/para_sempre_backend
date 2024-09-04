import { CreateInvite, CreateInviteParams, CreateInviteResult, LoadInvite, LoadInviteParams, LoadInviteResult } from '@/domain/usecases/invite'
export class CreateInviteSpy implements CreateInvite {
  createInviteParams: CreateInviteParams | undefined
  result: CreateInviteResult = {
    inviteId: 'any_invite_id',
    accountId: 'any_account_id',
    inviteCode: 'any_invite_code',
    emailUser: 'any_email@user.com',
    phoneUser: '1234567890',
    status: 'active',
    inviteType: 'event',
    createdAt: new Date('2024-09-03T21:15:45.224Z'),
    expiration: new Date('2024-09-03T21:16:18.671Z'),
    usedAt: null,
    maxUses: 1
  }

  async create(inviteData: CreateInviteParams): Promise<CreateInviteResult> {
    this.createInviteParams = inviteData
    return this.result
  }
}

export class LoadInviteSpy implements LoadInvite {
  params: LoadInviteParams
  result: LoadInviteResult = {
    inviteId: 'any_invite_id',
    accountId: 'any_account_id',
    inviteCode: 'any_invite_code',
    emailUser: 'any_email@user.com',
    phoneUser: '1234567890',
    status: 'active',
    expiration: new Date(),
    usedAt: null
  }

  callsCount = 0

  async load(params: LoadInviteParams): Promise<LoadInviteResult> {
    this.params = params
    this.callsCount++
    return this.result
  }
}
