import { DbLoadInvite } from '@/application/usecases/invite'
import { LoadInvite } from '@/domain/usecases'
import { InviteMongoRepository } from '@/infra/db'

export const makeDbLoadInviteCode = (): LoadInvite => {
  const inviteMongoRepository = new InviteMongoRepository()
  return new DbLoadInvite(inviteMongoRepository)
}
