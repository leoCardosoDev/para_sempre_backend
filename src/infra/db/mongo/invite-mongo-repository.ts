import { CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'
import {
  CheckEmailRepository,
  CheckEmailRepositoryResult,
  CreateInviteRepository,
  LoadInviteByCodeRepository,
  LoadInviteByCodeRepositoryResult,
  UpdateInviteRepository,
  UpdateInviteRepositoryParams,
  UpdateInviteRepositoryResult
} from '@/application/protocols/db'
import { MongoHelper } from '@/infra/db/mongo'

export class InviteMongoRepository implements CreateInviteRepository, CheckEmailRepository, LoadInviteByCodeRepository, UpdateInviteRepository {
  async createInvite(_inviteData: CreateInviteParams): Promise<CreateInviteResult> {
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
          accountId: 1,
          inviteCode: 1,
          emailUser: 1,
          phoneUser: 1,
          status: 1,
          expiration: 1,
          usedAt: 1,
          maxUses: 1,
          inviteType: 1,
          createdAt: 1
        }
      }
    )
    if (!invite) {
      return null
    }
    return {
      inviteId: invite._id.toHexString(),
      accountId: invite.accountId,
      inviteCode: invite.inviteCode,
      emailUser: invite.emailUser,
      phoneUser: invite.phoneUser,
      status: invite.status,
      expiration: invite.expiration,
      usedAt: invite.usedAt,
      maxUses: invite.maxUses,
      inviteType: invite.inviteType,
      createdAt: invite.createdAt
    } as LoadInviteByCodeRepositoryResult
  }

  async checkByEmail(emailUser: string): Promise<CheckEmailRepositoryResult> {
    const inviteCollection = await MongoHelper.getCollection('invites')
    const emailInUse = await inviteCollection.findOne({ emailUser }, { projection: { _id: 1 } })
    return !!emailInUse
  }

  async updateByCode(invite: UpdateInviteRepositoryParams): Promise<UpdateInviteRepositoryResult> {
    const inviteCollection = await MongoHelper.getCollection('invites')
    const result = await inviteCollection.updateOne(
      { inviteCode: invite.inviteCode },
      {
        $set: {
          status: invite.status,
          expiration: invite.expiration,
          usedAt: invite.usedAt
        }
      }
    )
    return result.matchedCount > 0
  }
}
