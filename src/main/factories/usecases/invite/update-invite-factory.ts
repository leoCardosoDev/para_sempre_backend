import { DbUpdateInvite } from '@/application/usecases/invite'
import { UpdateInvite } from '@/domain/usecases'
import { InviteMongoRepository } from '@/infra/db'

export const makeDbUpdateInviteCode = (): UpdateInvite => {
  const inviteMongoRepository = new InviteMongoRepository()
  return new DbUpdateInvite(inviteMongoRepository, inviteMongoRepository)
}
