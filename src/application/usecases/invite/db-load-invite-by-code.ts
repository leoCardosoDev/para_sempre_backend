import { Decrypter } from '@/application/protocols'
import { LoadInviteByCodeRepository } from '@/application/protocols/db/invite'
import { LoadInviteByCode, LoadInviteByCodeParams, LoadInviteByCodeResult } from '@/domain/usecases/invite'

export class DbLoadInviteByCode implements LoadInviteByCode {
  constructor(
    private readonly _decrypter: Decrypter,
    private readonly _loadByCodeRepository: LoadInviteByCodeRepository
  ) {}

  async load(_params: LoadInviteByCodeParams): Promise<LoadInviteByCodeResult> {
    await this._decrypter.decrypt(_params.inviteCode)
    await this._loadByCodeRepository.loadByCode(_params)
    return null
  }
}
