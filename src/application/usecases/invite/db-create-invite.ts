import { Encrypter } from '@/application/protocols'
import { CreateInviteRepository } from '@/application/protocols/db/invite'
import { CreateInvite, CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

export class DbCreateInvite implements CreateInvite {
  constructor(
    private readonly _createInviteRepository: CreateInviteRepository,
    private readonly _encrypter: Encrypter
  ) {}

  async create(_invite: CreateInviteParams): Promise<CreateInviteResult> {
    _invite.inviteCode = await this._encrypter.encrypt(_invite.emailUser)
    const result = await this._createInviteRepository.create(_invite)
    return result
  }
}
