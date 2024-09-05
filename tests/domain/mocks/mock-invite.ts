import { CreateInvite, CreateInviteParams, CreateInviteResult, LoadInvite, LoadInviteParams, LoadInviteResult, UpdateInvite, UpdateInviteParams, UpdateInviteResult } from '@/domain/usecases/invite'
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
  result: LoadInviteResult | null = {
    inviteId: 'any_invite_id',
    accountId: 'any_account_id',
    inviteCode: 'any_invite_code',
    emailUser: 'any_email@user.com',
    phoneUser: '1234567890',
    status: 'active',
    expiration: new Date('2025-01-29T01:29:12.841Z'),
    usedAt: null
  }

  callsCount = 0

  async load(params: LoadInviteParams): Promise<LoadInviteResult> {
    this.params = params
    this.callsCount++
    return this.result
  }
}

export class UpdateInviteSpy implements UpdateInvite {
  updateParams: UpdateInviteParams | null = null
  result: UpdateInviteResult = true
  callsCount = 0

  async update(params: UpdateInviteParams): Promise<UpdateInviteResult> {
    this.updateParams = params
    this.callsCount++
    return this.result
  }
}
