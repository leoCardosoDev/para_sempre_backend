import { CheckEmailRepository } from '@/application/protocols/db/email'
import { CreateInviteRepository, InviteCodeGenerator } from '@/application/protocols/db/invite'
import { EmailInUseError, InvalidExpirationDateError } from '@/domain/errors'
import { CreateInvite, CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

export class DbCreateInvite implements CreateInvite {
  constructor(
    private readonly _checkEmailRepository: CheckEmailRepository,
    private readonly _createInviteRepository: CreateInviteRepository,
    private readonly _inviteGenerator: InviteCodeGenerator
  ) {}

  async create(_invite: CreateInviteParams): Promise<CreateInviteResult> {
    const emailInUse = await this._checkEmailRepository.checkByEmail(_invite.emailUser)
    if (emailInUse) {
      throw new EmailInUseError()
    }
    if (_invite.expiration <= _invite.createdAt) {
      throw new InvalidExpirationDateError()
    }
    const inviteCode = await this._inviteGenerator.generate()
    const inviteData = { ..._invite, inviteCode }
    const result = await this._createInviteRepository.createInvite(inviteData)
    return result
  }
}
