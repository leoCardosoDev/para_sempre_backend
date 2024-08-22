import { InviteMongoRepository, MongoHelper } from '@/infra/db'
import { faker } from '@faker-js/faker'

import { Collection } from 'mongodb'

const makeSut = (): InviteMongoRepository => {
  return new InviteMongoRepository()
}

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
    inviteCollection = MongoHelper.getCollection('invites')
    await inviteCollection.deleteMany({})
  })

  describe('create()', () => {
    it('should create invite on success', async () => {
      const sut = makeSut()
      await sut.create({
        accountId: 'any_account_id',
        inviteCode: faker.string.uuid(),
        emailUser: faker.internet.email(),
        phoneUser: faker.string.numeric({ length: { min: 10, max: 12 }}),
        status: faker.word.sample(),
        inviteType: faker.word.sample(),
        createdAt: faker.date.recent(),
        expiration: faker.date.future(),
        usedAt: null,
        maxUses: faker.number.int({min: 0, max: 1})
      })
      const invite = await inviteCollection.findOne({ accountId: 'any_account_id', })
      expect(invite).toBeTruthy()
      expect(invite?._id).toBeTruthy()
    })
  })
})
