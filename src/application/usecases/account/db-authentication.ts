import { Authentication } from '@/domain/usecases'
import { HashComparer, Encrypter, LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '@/application/protocols'
import { AuthenticationParams, AuthenticationResult } from '@/domain/types'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly _loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly _hashComparer: HashComparer,
    private readonly _encrypter: Encrypter,
    private readonly _updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(authenticationParams: AuthenticationParams): Promise<AuthenticationResult> {
    const account = await this._loadAccountByEmailRepository.loadByEmail(authenticationParams.email)
    if (account) {
      const isValid = await this._hashComparer.compare(authenticationParams.password, account.password)
      if (isValid) {
        const accessToken = await this._encrypter.encrypt(account.id)
        await this._updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return {
          accessToken,
          name: account.name
        }
      }
    }
    return null
  }
}
