import { CreateAccount, CreateAccountParams, CreateAccountResult } from '@/domain/usecases'
import { Hasher, CreateAccountRepository } from '@/application/protocols'
import { CheckEmailRepository } from '@/application/protocols/db/email'

export class DbCreateAccount implements CreateAccount {
  constructor(
    private readonly _hasher: Hasher,
    private readonly _createAccountRepository: CreateAccountRepository,
    private readonly _checkAccountByEmailRepository: CheckEmailRepository
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
