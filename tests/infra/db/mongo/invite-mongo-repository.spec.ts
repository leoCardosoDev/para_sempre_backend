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
  })
})
