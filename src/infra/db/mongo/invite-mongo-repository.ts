import { CreateInviteRepository } from '@/application/protocols/db/invite'
import { CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'
import { MongoHelper } from '@/infra/db/mongo'

export class InviteMongoRepository implements CreateInviteRepository {
  async create(_invateData: CreateInviteParams): Promise<CreateInviteResult> {
    const inviteCollection = await MongoHelper.getCollection('invites')
    const result = await inviteCollection.insertOne(_invateData)
    return result.insertedId !== null
  }
}
