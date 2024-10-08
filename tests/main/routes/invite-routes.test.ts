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
  await accountCollection.updateOne(
    {
      _id: res.insertedId
    },
    {
      $set: {
        accessToken
      }
    }
  )
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

  afterEach(() => {
    jest.restoreAllMocks()
  })

  beforeEach(async () => {
    inviteCollection = MongoHelper.getCollection('invites')
    await inviteCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /invites/create', () => {
    it('Should return 403 on create invite without accessToken', async () => {
      await request(app)
        .post('/api/invites/create')
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

    it('Should return 200 on invite', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .post('/api/invites/create')
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

  describe('POST /invites/result', () => {
    it('Should return 403 when getting invite without accessToken', async () => {
      await request(app).post(`/api/invites/result`).send({ inviteCode: 'any_code' }).expect(403)
    })

    it('Should return 404 when invite is not found', async () => {
      const accessToken = await mockAccessToken()
      const invalidInviteCode = 'nonExistentInviteCode'
      await request(app).post(`/api/invites/result`).set('x-access-token', accessToken).send({ inviteCode: invalidInviteCode }).expect(404)
    })

    it('Should return 200 and the invite data when getting invite with valid accessToken and inviteCode', async () => {
      const accessToken = await mockAccessToken()
      const inviteCode = 'wedfrdfr'

      await inviteCollection.insertOne({
        accountId: '1234',
        inviteCode,
        emailUser: 'leo@gmail.com',
        phoneUser: '00000000000',
        status: 'created',
        inviteType: 'standart',
        createdAt: '2024-08-20T17:20:34.000Z',
        expiration: '2024-09-20T17:20:34.000Z',
        usedAt: null,
        maxUses: 1
      })

      await request(app)
        .post(`/api/invites/result`)
        .set('x-access-token', accessToken)
        .send({ inviteCode })
        .expect(200)
        .expect(response => {
          expect(response.body).toHaveProperty('inviteId')
          expect(response.body).toHaveProperty('emailUser')
          expect(response.body).toHaveProperty('status')
        })
    })
  })

  describe('POST /invites/update', () => {
    it('Should return 403 when getting invite without accessToken', async () => {
      await request(app).post(`/api/invites/update`).send({ inviteCode: 'any_code' }).expect(403)
    })

    it('Should return 404 when invite is not found', async () => {
      const accessToken = await mockAccessToken()
      const invalidInviteCode = 'nonExistentInviteCode'
      await request(app)
        .post(`/api/invites/update`)
        .set('x-access-token', accessToken)
        .send({
          inviteCode: invalidInviteCode,
          status: 'used',
          createdAt: '2024-08-20T17:20:34.000Z',
          expiration: '2024-09-20T17:20:34.000Z',
          usedAt: '2024-09-20T18:20:34.000Z',
          accountId: '1234',
          emailUser: 'leo@gmail.com',
          phoneUser: '00000000000',
          inviteType: 'standart',
          maxUses: 1
        })
        .expect(404)
    })

    it('Should return 200 and the invite data when getting invite with valid accessToken and inviteCode', async () => {
      const accessToken = await mockAccessToken()
      const inviteCode = 'wedfrdfr'

      await inviteCollection.insertOne({
        accountId: '1234',
        inviteCode,
        status: 'active',
        createdAt: '2024-08-20T17:20:34.000Z',
        expiration: '2024-09-20T17:20:34.000Z',
        usedAt: null,
        emailUser: 'leo@gmail.com',
        phoneUser: '00000000000',
        inviteType: 'standart',
        maxUses: 1
      })

      await request(app)
        .post(`/api/invites/update`)
        .set('x-access-token', accessToken)
        .send({
          inviteCode,
          status: 'used',
          createdAt: '2024-08-20T17:20:34.000Z',
          expiration: '2024-09-20T17:20:34.000Z',
          usedAt: '2024-09-20T18:20:34.000Z',
          emailUser: 'leo@gmail.com',
          phoneUser: '00000000000',
          inviteType: 'standart',
          maxUses: 1
        })
        .expect(200)
        .expect(response => {
          expect(response.body).toBe(true)
        })
    })
  })
})
