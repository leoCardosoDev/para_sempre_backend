import { CheckEmailRepository, CreateAccountWithInviteRepository, Hasher, LoadInviteByCodeRepository, OmitInviteCode, UpdateInviteRepository } from '@/application/protocols'
import { CreateAccountWithInvite, CreateAccountWithInviteParams, CreateAccountWithInviteResult } from '@/domain/usecases'

export class DbCreateAccountWithInvite implements CreateAccountWithInvite {
  constructor(
    private readonly _loadInviteByCodeRepository: LoadInviteByCodeRepository,
    private readonly _checkEmailRepository: CheckEmailRepository,
    private readonly _hasher: Hasher,
    private readonly _createAccountWithInviteRepository: CreateAccountWithInviteRepository,
    private readonly _updateInviteRepository: UpdateInviteRepository
  ) {}

  async create(accountData: CreateAccountWithInviteParams): Promise<CreateAccountWithInviteResult> {
    const invite = await this._loadInviteByCodeRepository.loadByCode(accountData.inviteCode)
    if (!invite) return { success: false, error: 'Invalid invite code' }
    if (invite.status === 'used') return { success: false, error: 'Used invite code' }
    if (invite.emailUser !== accountData.email) return { success: false, error: 'Email does not match the invite' }
    const emailExist = await this._checkEmailRepository.checkByEmail(accountData.email)
    if (emailExist) return { success: false, error: 'Email already registered' }
    const hashedPassword = await this._hasher.hash(accountData.password)
    const accountDataWithoutInviteCode: OmitInviteCode<CreateAccountWithInviteParams> = {
      name: accountData.name,
      email: accountData.email,
      password: hashedPassword,
      inviteId: invite.inviteId
    }
    const createResult = await this._createAccountWithInviteRepository.create(accountDataWithoutInviteCode)
    if (createResult.success) {
      await this._updateInviteRepository.updateByCode({
        inviteCode: invite.inviteCode,
        status: 'used',
        expiration: invite.expiration,
        usedAt: new Date(),
        emailUser: invite.emailUser,
        phoneUser: invite.phoneUser,
        inviteType: 'standart',
        maxUses: 2
      })
    }
    return { ...createResult, inviteId: invite.inviteId }
  }
}
