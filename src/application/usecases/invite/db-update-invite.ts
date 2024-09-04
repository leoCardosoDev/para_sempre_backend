import { LoadInviteByCodeRepository, UpdateInviteRepository } from '@/application/protocols'
import { UpdateInvite, UpdateInviteParams, UpdateInviteResult } from '@/domain/usecases'

export class DbUpdateInvite implements UpdateInvite {
  constructor(
    private readonly _loadInviteByCodeRepository: LoadInviteByCodeRepository,
    private readonly _updateInviteRepository: UpdateInviteRepository
  ) {}

  async update(params: UpdateInviteParams): Promise<UpdateInviteResult> {
    const invite = await this._loadInviteByCodeRepository.loadByCode(params.inviteCode)
    if (!invite) return false
    const result = await this._updateInviteRepository.updateByCode(params)
    return result
  }
}
