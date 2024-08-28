import { InviteMongoRepository } from '@/infra/db'
import { CreateInvite } from '@/domain/usecases/invite'
import { DbCreateInvite } from '@/application/usecases/invite'
import { JwtAdapter } from '@/infra/cryptography'
import env from '@/main/config/env'

export const makeDbCreateInvite = (): CreateInvite => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const inviteMongoRepository = new InviteMongoRepository()
  return new DbCreateInvite(inviteMongoRepository, jwtAdapter)
}
