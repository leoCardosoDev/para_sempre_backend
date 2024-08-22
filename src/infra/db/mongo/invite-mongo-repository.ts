import { CreateInviteRepository, LoadInviteByCodeRepository, LoadInviteByCodeRepositoryResult } from '@/application/protocols/db/invite'
import { CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'
import { MongoHelper } from '@/infra/db/mongo'

export class InviteMongoRepository implements CreateInviteRepository, LoadInviteByCodeRepository {
  async create(_inviteData: CreateInviteParams): Promise<CreateInviteResult> {
    const inviteCollection = await MongoHelper.getCollection('invites')
    const result = await inviteCollection.insertOne(_inviteData)
    const inviteWithId = { ..._inviteData, _id: result.insertedId }
    return MongoHelper.map(inviteWithId)
  }

  async loadByCode(inviteCode: string): Promise<LoadInviteByCodeRepositoryResult> {
    const inviteCollection = await MongoHelper.getCollection('invites')
    const invite = await inviteCollection.findOne(
      {
        inviteCode
      },
      {
        projection: {
          _id: 1,
          emailUser: 1,
          phoneUser: 1,
          status: 1,
          expiration: 1
        }
      }
    )
    return invite && MongoHelper.map(invite)
  }
}
