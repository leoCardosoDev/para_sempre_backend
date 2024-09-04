import { LoadInviteByCodeRepository } from '@/application/protocols'
import { LoadInvite, LoadInviteParams, LoadInviteResult } from '@/domain/usecases'

export class DbLoadInvite implements LoadInvite {
  constructor(private readonly _loadInviteByCodeRepository: LoadInviteByCodeRepository) {}
  async load(params: LoadInviteParams): Promise<LoadInviteResult> {
    await this._loadInviteByCodeRepository.loadByCode(params.inviteCode)
    return new Promise(resolve => resolve(null))
  }
}
