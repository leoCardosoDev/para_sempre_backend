import { CheckEmailRepository } from '@/application/protocols/db/email'
import { CreateInviteRepository, InviteCodeGenerator, LoadInviteByCodeRepository } from '@/application/protocols/db/invite'
import { EmailInUseError, InvalidExpirationDateError } from '@/domain/errors'
import { CreateInvite, CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

export class DbCreateInvite implements CreateInvite {
  constructor(
    private readonly _checkEmailRepository: CheckEmailRepository,
    private readonly _createInviteRepository: CreateInviteRepository,
    private readonly _inviteGenerator: InviteCodeGenerator,
    private readonly _loadInviteByCodeRepository: LoadInviteByCodeRepository
  ) {}

  async create(invite: CreateInviteParams): Promise<CreateInviteResult> {
    const emailInUse = await this._checkEmailRepository.checkByEmail(invite.emailUser)
    if (emailInUse) {
      throw new EmailInUseError()
    }
    if (invite.expiration < invite.createdAt) {
      throw new InvalidExpirationDateError()
    }
    let inviteCode = await this._inviteGenerator.generate()
    let inviteExists = await this._loadInviteByCodeRepository.loadByCode(inviteCode)
    while (inviteExists) {
      inviteCode = await this._inviteGenerator.generate()
      inviteExists = await this._loadInviteByCodeRepository.loadByCode(inviteCode)
    }
    const inviteData = { ...invite, inviteCode }
    const result = await this._createInviteRepository.createInvite(inviteData)
    return result
  }
}
