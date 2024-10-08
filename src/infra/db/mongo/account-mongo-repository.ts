import { MongoHelper } from '@/infra/db'
import {
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository,
  LoadAccountByEmailRepositoryResult,
  LoadAccountByTokenRepositoryResult,
  CheckEmailRepository,
  CheckEmailRepositoryResult,
  CreateAccountWithInviteRepositoryParams,
  CreateAccountWithInviteRepositoryResult
} from '@/application/protocols/db'
import { ObjectId } from 'mongodb'

export class AccountMongoRepository implements LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository, CheckEmailRepository {
  async create(data: CreateAccountWithInviteRepositoryParams): Promise<CreateAccountWithInviteRepositoryResult> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(data)
    return {
      success: result.insertedId !== null
    }
  }

  async loadByEmail(email: string): Promise<LoadAccountByEmailRepositoryResult> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne(
      {
        email
      },
      {
        projection: {
          _id: 1,
          name: 1,
          password: 1
        }
      }
    )
    return account && MongoHelper.map(account)
  }

  async checkByEmail(email: string): Promise<CheckEmailRepositoryResult> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne(
      {
        email
      },
      {
        projection: {
          _id: 1
        }
      }
    )
    return account !== null
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      {
        _id: new ObjectId(id)
      },
      {
        $set: {
          accessToken: token
        }
      }
    )
  }

  async loadByToken(token: string, role?: string): Promise<LoadAccountByTokenRepositoryResult> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne(
      {
        accessToken: token,
        $or: [
          {
            role
          },
          {
            role: 'admin'
          }
        ]
      },
      {
        projection: {
          _id: 1
        }
      }
    )
    return account && MongoHelper.map(account)
  }
}
