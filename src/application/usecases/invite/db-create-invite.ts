import { Encrypter } from '@/application/protocols'
import { CreateInviteRepository } from '@/application/protocols/db/invite'
import { InvalidExpirationDateError } from '@/domain/errors'
import { CreateInvite, CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

export class DbCreateInvite implements CreateInvite {
  constructor(
    private readonly _createInviteRepository: CreateInviteRepository,
    private readonly _encrypter: Encrypter
  ) {}

  async create(_invite: CreateInviteParams): Promise<CreateInviteResult> {
    if (_invite.expiration <= _invite.createdAt) {
      throw new InvalidExpirationDateError()
    }
    _invite.inviteCode = await this._encrypter.encrypt(_invite.emailUser)
    const result = await this._createInviteRepository.createInvite(_invite)
    return result
  }
}
