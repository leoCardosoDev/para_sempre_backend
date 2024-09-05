import { InviteMongoRepository } from '@/infra/db'

import { DbCreateInvite } from '@/application/usecases/invite'
import { RandomInviteCodeGenerator } from '@/infra/services'
import { CreateInvite } from '@/domain/usecases/invite'

export const makeDbCreateInvite = (): CreateInvite => {
  const inviteMongoRepository = new InviteMongoRepository()
  const randomInviteGenerator = new RandomInviteCodeGenerator()
  return new DbCreateInvite(inviteMongoRepository, inviteMongoRepository, randomInviteGenerator, inviteMongoRepository)
}
