import { CreateAccount } from '@/domain/usecases'
import { Hasher, CreateAccountRepository, CheckAccountByEmailRepository } from '@/application/protocols'
import { CreateAccountParams, CreateAccountResult } from '@/domain/types'

export class DbCreateAccount implements CreateAccount {
  constructor(
    private readonly _hasher: Hasher,
    private readonly _createAccountRepository: CreateAccountRepository,
    private readonly _checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) {}

  async create(accountData: CreateAccountParams): Promise<CreateAccountResult> {
    const exists = await this._checkAccountByEmailRepository.checkByEmail(accountData.email)
    let isValid = false
    if (!exists) {
      const hashedPassword = await this._hasher.hash(accountData.password)
      isValid = await this._createAccountRepository.create({
        ...accountData,
        password: hashedPassword
      })
    }
    return isValid
  }
}
