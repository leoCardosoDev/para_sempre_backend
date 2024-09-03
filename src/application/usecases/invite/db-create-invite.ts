import { CreateInviteRepository, InviteCodeGenerator } from '@/application/protocols/db/invite'
import { CreateInvite, CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

export class DbCreateInvite implements CreateInvite {
  constructor(
    private readonly _createInviteRepository: CreateInviteRepository,
    private readonly _inviteGenerator: InviteCodeGenerator
  ) {}

  async create(_invite: CreateInviteParams): Promise<CreateInviteResult> {
    const inviteCode = await this._inviteGenerator.generate()
    const inviteData = { ..._invite, inviteCode }
    const result = await this._createInviteRepository.createInvite(inviteData)
    return result
  }
}
