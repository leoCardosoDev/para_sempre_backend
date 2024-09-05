import { LoadInviteByCodeRepository } from '@/application/protocols'
import { CreateAccountWithInvite, CreateAccountWithInviteParams, CreateAccountWithInviteResult } from '@/domain/usecases'

export class DbCreateAccountWithInvite implements CreateAccountWithInvite {
  constructor(private readonly _loadInviteByCodeRepository: LoadInviteByCodeRepository) {}
  async create(accountData: CreateAccountWithInviteParams): Promise<CreateAccountWithInviteResult> {
    const invite = await this._loadInviteByCodeRepository.loadByCode(accountData.inviteCode)
    if (!invite || invite.status !== 'active') return { success: false, error: 'Invalid or used invite code' }
    return { success: true }
  }
}
