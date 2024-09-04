import { LoadInviteByCodeRepository } from '@/application/protocols'
import { UpdateInvite, UpdateInviteParams, UpdateInviteResult } from '@/domain/usecases'

export class DbUpdateInvite implements UpdateInvite {
  constructor(private readonly _loadInviteByCodeRepository: LoadInviteByCodeRepository) {}
  async update(params: UpdateInviteParams): Promise<UpdateInviteResult> {
    const invite = await this._loadInviteByCodeRepository.loadByCode(params.inviteCode)
    if (!invite) return false
    return true
  }
}
