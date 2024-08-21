import { CreateInviteRepository } from '@/application/protocols/db/invite'
import { CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'
import { MongoHelper } from '@/infra/db/mongo'

export class InviteMongoRepository implements CreateInviteRepository {
  async create(_inviteData: CreateInviteParams): Promise<CreateInviteResult> {
    const inviteCollection = await MongoHelper.getCollection('invites')
    const result = await inviteCollection.insertOne(_inviteData)
    if (result.insertedId !== null) {
      return {
        inviteCode: _inviteData.inviteCode,
        status: _inviteData.status,
        expiration: _inviteData.expiration
      }
    }
    return null
  }
}
