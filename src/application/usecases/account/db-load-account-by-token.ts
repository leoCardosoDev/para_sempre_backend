import { LoadAccountByToken, LoadAccountByTokenResult } from '@/domain/usecases'
import { Decrypter, LoadAccountByTokenRepository } from '@/application/protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly _decrypter: Decrypter,
    private readonly _loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(accessToken: string, role?: string): Promise<LoadAccountByTokenResult> {
    let token: string
    try {
      token = await this._decrypter.decrypt(accessToken)
    } catch {
      return null
    }
    if (token) {
      const account = await this._loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (account) {
        return account
      }
    }
    return null
  }
}
