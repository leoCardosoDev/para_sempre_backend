import { DbLoadInviteByCode } from '@/application/usecases/invite'
import { LoadInviteByCode } from '@/domain/usecases/invite'
import { InviteMongoRepository } from '@/infra/db/mongo'

export const makeDbLoadInviteByCode = (): LoadInviteByCode => {
  const inviteMongoRepository = new InviteMongoRepository()
  return new DbLoadInviteByCode(inviteMongoRepository)
}
