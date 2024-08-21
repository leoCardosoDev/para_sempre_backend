import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db'
import { setupApp } from '@/main/config/app'

import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import { Express } from 'express'
import request from 'supertest'


let inviteCollection: Collection
let accountCollection: Collection
let app: Express

const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Leo',
    email: 'leosilva@gmail.com',
    password: '123',
    role: 'admin'
  })
  const id = res.insertedId.toHexString()
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: res.insertedId
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

describe('Invite Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
    const uri: string = process.env.MONGO_URL ?? 'mongodb://localhost:27017/test'
    await MongoHelper.connect(uri)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    inviteCollection = MongoHelper.getCollection('invites')
    await inviteCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /invites', () => {
    test('Should return 403 on create invite without accessToken', async () => {
      await request(app)
        .post('/api/invites')
        .send({
          emailUser: 'leo@gmail.com',
          phoneUser: '00000000000',
          status: 'created',
          inviteType: 'standart',
          createdAt: '2024-08-20T17:20:34.000Z',
          expiration: '2024-09-20T17:20:34.000Z',
          maxUses: 1
        })
        .expect(403)
    })

    test('Should return 200 on invite', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .post('/api/invites')
        .set('x-access-token', accessToken)
        .send({
          emailUser: 'leo@gmail.com',
          phoneUser: '00000000000',
          status: 'created',
          inviteType: 'standart',
          createdAt: '2024-08-20T17:20:34.000Z',
          expiration: '2024-09-20T17:20:34.000Z',
          maxUses: 1
        })
        .expect(200)
    })
  })

})
