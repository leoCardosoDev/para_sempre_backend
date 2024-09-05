import { LoadInviteByCodeRepository } from '@/application/protocols'
import { LoadInvite, LoadInviteParams, LoadInviteResult } from '@/domain/usecases'

export class DbLoadInvite implements LoadInvite {
  constructor(private readonly _loadInviteByCodeRepository: LoadInviteByCodeRepository) {}
  async load(params: LoadInviteParams): Promise<LoadInviteResult> {
    const invite = await this._loadInviteByCodeRepository.loadByCode(params.inviteCode)
    return invite
  }
}
