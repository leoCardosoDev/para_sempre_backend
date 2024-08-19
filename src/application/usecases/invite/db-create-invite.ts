import { CreateInviteRepository } from '@/application/protocols/db/invite'
import { CreateInvite, CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

export class DbCreateInvite implements CreateInvite {
  constructor(private readonly _createInviteRepository: CreateInviteRepository) {}
  async create(_invite: CreateInviteParams): Promise<CreateInviteResult> {
    const result = await this._createInviteRepository.create(_invite)
    return result
  }
}
