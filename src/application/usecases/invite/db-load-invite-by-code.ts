import { Decrypter } from '@/application/protocols'
import { LoadInviteByCode, LoadInviteByCodeParams, LoadInviteByCodeResult } from '@/domain/usecases/invite'

export class DbLoadInviteByCode implements LoadInviteByCode {
  constructor(private readonly _decrypter: Decrypter) {}
  async load(_params: LoadInviteByCodeParams): Promise<LoadInviteByCodeResult> {
    await this._decrypter.decrypt(_params.inviteCode)
    return null
  }
}
