import { LoadInviteByCodeRepository } from '@/application/protocols/db/invite'
import { LoadInviteByCode, LoadInviteByCodeParams, LoadInviteByCodeResult } from '@/domain/usecases/invite'

export class DbLoadInviteByCode implements LoadInviteByCode {
  constructor(private readonly _loadByCodeRepository: LoadInviteByCodeRepository) {}

  async load(_params: LoadInviteByCodeParams): Promise<LoadInviteByCodeResult> {
    const inviteData = await this._loadByCodeRepository.loadByCode(_params)
    return inviteData
  }
}
