import { DbCreateAccount } from '@/application/usecases'
import { CreateAccount } from '@/domain/usecases'
import { AccountMongoRepository } from '@/infra/db'
import { BcryptAdapter } from '@/infra/cryptography'

export const makeDbCreateAccount = (): CreateAccount => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbCreateAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}
