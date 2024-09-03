import { CreateInvite, CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'
export class CreateInviteSpy implements CreateInvite {
  createInviteParams: CreateInviteParams | undefined // Para armazenar os parâmetros recebidos
  result: CreateInviteResult = {
    accountId: 'any_account_id',
    inviteCode: 'any_invite_code',
    emailUser: 'any_email@user.com',
    phoneUser: '1234567890',
    status: 'active',
    inviteType: 'event',
    createdAt: new Date(),
    expiration: new Date(),
    usedAt: null,
    maxUses: 1
  }

  async create(inviteData: CreateInviteParams): Promise<CreateInviteResult> {
    this.createInviteParams = inviteData
    return this.result
  }
}
