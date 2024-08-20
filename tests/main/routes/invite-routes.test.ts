import { MongoHelper } from '@/infra/db'
import { setupApp } from '@/main/config/app'

import { Collection } from 'mongodb'
import { Express } from 'express'
import request from 'supertest'


let inviteCollection: Collection
let app: Express

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
  })

  describe('POST /invites', () => {
    test('Should return 200 on invite', async () => {
      await request(app)
        .post('/api/invites')
        .send({
          inviteId: '1',
          adminId: '1',
          inviteCode: '1234',
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
