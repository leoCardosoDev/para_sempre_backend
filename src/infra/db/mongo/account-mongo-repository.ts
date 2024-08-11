import { MongoHelper } from '@/infra/db'
import { CreateAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository, CheckAccountByEmailRepository } from '@/application/protocols/db'
import { ObjectId, Document } from 'mongodb'
import { CheckAccountByEmailRepositoryResult, CreateAccountRepositoryParams, LoadAccountByEmailRepositoryResult, LoadAccountByTokenRepositoryResult } from '@/application/types'

export interface AccountDocument extends Document {
  name: string
  email: string
  password: string
}

export class AccountMongoRepository implements CreateAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository, CheckAccountByEmailRepository {
  async create(data: CreateAccountRepositoryParams): Promise<boolean> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(data)
    return result.insertedId !== null
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

  async checkByEmail(email: string): Promise<CheckAccountByEmailRepositoryResult> {
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
