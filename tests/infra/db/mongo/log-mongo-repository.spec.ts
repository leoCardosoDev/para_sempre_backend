import { LogMongoRepository, MongoHelper } from '@/infra/db'

import { Collection } from 'mongodb'
import { faker } from '@faker-js/faker'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

let errorCollection: Collection
const uri = process.env.MONGO_URL || 'mongodb://localhost:27017/test'

describe('LogMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(uri)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  it('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError(faker.lorem.words())
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
