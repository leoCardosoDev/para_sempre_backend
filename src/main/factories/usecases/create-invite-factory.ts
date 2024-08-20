import { InviteMongoRepository } from '@/infra/db'
import { CreateInvite } from '@/domain/usecases/invite'
import { DbCreateInvite } from '@/application/usecases/invite'

export const makeDbCreateInvite = (): CreateInvite => {
  const inviteMongoRepository = new InviteMongoRepository()
  return new DbCreateInvite(inviteMongoRepository)
}
