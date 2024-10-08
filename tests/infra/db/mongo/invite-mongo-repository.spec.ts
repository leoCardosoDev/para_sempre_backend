import { CreateInviteParams } from '@/domain/usecases/invite'
import { InviteMongoRepository, MongoHelper } from '@/infra/db'
import { faker } from '@faker-js/faker'

import { Collection } from 'mongodb'

const makeSut = (): InviteMongoRepository => {
  return new InviteMongoRepository()
}

const mockInviteParams = (): CreateInviteParams => ({
  accountId: 'any_account_id',
  inviteCode: faker.string.uuid(),
  emailUser: faker.internet.email(),
  phoneUser: faker.string.numeric({ length: { min: 10, max: 12 } }),
  status: faker.word.sample(),
  inviteType: faker.word.sample(),
  createdAt: faker.date.recent(),
  expiration: faker.date.future(),
  usedAt: null,
  maxUses: faker.number.int({ min: 0, max: 1 })
})

let inviteCollection: Collection
const uri = process.env.MONGO_URL || 'mongodb://localhost:27017/test'

describe('Invite Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(uri)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    inviteCollection = await MongoHelper.getCollection('invites')
    await inviteCollection.deleteMany({})
  })

  describe('create()', () => {
    it('should create invite on success', async () => {
      const sut = makeSut()
      await sut.createInvite(mockInviteParams())
      const invite = await inviteCollection.findOne({ accountId: 'any_account_id' })
      expect(invite).toBeTruthy()
      expect(invite?._id).toBeTruthy()
    })
  })

  describe('loadByCode', () => {
    it('should return an invite on success', async () => {
      const sut = makeSut()
      const createInvite = mockInviteParams()
      await inviteCollection.insertOne(createInvite)
      const invite = await sut.loadByCode(createInvite.inviteCode)
      expect(invite).toBeTruthy()
      expect(invite?.emailUser).toBe(createInvite.emailUser)
    })

    it('should return null if result null', async () => {
      const sut = makeSut()
      const invite = await sut.loadByCode('non_existing_invite_code') // Passe um código que não existe
      expect(invite).toBeNull()
    })
  })

  describe('checkByEmail()', () => {
    it('should return true if email is in use', async () => {
      const sut = makeSut()
      const createInvite = mockInviteParams()
      await inviteCollection.insertOne(createInvite)
      const emailInUse = await sut.checkByEmail(createInvite.emailUser)
      expect(emailInUse).toBe(true)
    })

    it('should return false if email is not in use', async () => {
      const sut = makeSut()
      const emailInUse = await sut.checkByEmail(faker.internet.email())
      expect(emailInUse).toBe(false)
    })
  })
  describe('updateByCode()', () => {
    it('should update invite status, expiration, and usedAt on success', async () => {
      const sut = makeSut()
      const createInvite = mockInviteParams()
      await inviteCollection.insertOne(createInvite)
      const updatedFields = {
        inviteCode: createInvite.inviteCode,
        status: 'updated_status',
        expiration: faker.date.future(),
        usedAt: new Date(),
        emailUser: faker.internet.email(),
        phoneUser: faker.string.numeric({ length: { min: 10, max: 12 } }),
        inviteType: faker.word.sample(),
        maxUses: faker.number.int({ min: 0, max: 1 })
      }
      const updateResult = await sut.updateByCode(updatedFields)
      const updatedInvite = await inviteCollection.findOne({ inviteCode: createInvite.inviteCode })
      expect(updateResult).toBe(true)
      expect(updatedInvite).toBeTruthy()
      expect(updatedInvite?.status).toBe(updatedFields.status)
      expect(updatedInvite?.expiration).toEqual(updatedFields.expiration)
      expect(updatedInvite?.usedAt).toEqual(updatedFields.usedAt)
    })

    it('should return false if no invite is found with the provided inviteCode', async () => {
      const sut = makeSut()
      const updateResult = await sut.updateByCode({
        inviteCode: 'non_existing_invite_code',
        status: 'updated_status',
        expiration: faker.date.future(),
        usedAt: new Date(),
        emailUser: faker.internet.email(),
        phoneUser: faker.string.numeric({ length: { min: 10, max: 12 } }),
        inviteType: faker.word.sample(),
        maxUses: faker.number.int({ min: 0, max: 1 })
      })
      expect(updateResult).toBe(false)
    })
  })
})
