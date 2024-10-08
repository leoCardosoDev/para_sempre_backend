import { MongoHelper } from '@/infra/db'
import { setupApp } from '@/main/config/app'

import { Collection } from 'mongodb'
import { Express } from 'express'
import request from 'supertest'
import { hash } from 'bcryptjs'

let accountCollection: Collection
let inviteCollection: Collection
let app: Express

describe('Login Routes', () => {
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

  describe('POST /signup', () => {
    it('Should return 200 on signup', async () => {
      const inviteCode = 'wedfrdfr'
      await inviteCollection.insertOne({
        accountId: '1234',
        inviteCode,
        emailUser: 'leosilva@gmail.com',
        phoneUser: '00000000000',
        status: 'created',
        inviteType: 'standart',
        createdAt: '2024-08-20T17:20:34.000Z',
        expiration: '2024-09-20T17:20:34.000Z',
        usedAt: null,
        maxUses: 1
      })
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Leo',
          email: 'leosilva@gmail.com',
          password: '123',
          passwordConfirmation: '123',
          inviteCode: 'wedfrdfr'
        })
        .expect(200)
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Leo',
          email: 'leosilva@gmail.com',
          password: '123',
          passwordConfirmation: '123',
          inviteCode: '123'
        })
        .expect(403)
    })
  })

  describe('POST /login', () => {
    it('Should return 200 on login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Leo',
        email: 'leosilva@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'leosilva@gmail.com',
          password: '123'
        })
        .expect(200)
    })

    it('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'leosilva@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
