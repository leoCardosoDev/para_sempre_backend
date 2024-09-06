import { DbCreateAccountWithInvite } from '@/application/usecases'
import { CreateAccountWithInvite } from '@/domain/usecases'
import { BcryptAdapter } from '@/infra/cryptography'
import { AccountMongoRepository, InviteMongoRepository } from '@/infra/db'

export const makeDbCreateAccountWithInvite = (): CreateAccountWithInvite => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const inviteMongoRepository = new InviteMongoRepository()
  const accountMongoRepository = new AccountMongoRepository()
  return new DbCreateAccountWithInvite(inviteMongoRepository, accountMongoRepository, bcryptAdapter, accountMongoRepository, inviteMongoRepository)
}
