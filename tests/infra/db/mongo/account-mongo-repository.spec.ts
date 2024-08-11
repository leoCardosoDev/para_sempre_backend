import { Collection, MongoClient, ObjectId } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongo/mongo-helper'
import { AccountMongoRepository } from '@/infra/db/mongo/account-mongo-repository'
import { mockAccountParams } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let accountCollection: Collection
const uri: string = process.env.MONGO_URL ?? 'mongodb://localhost:27017/test'

describe('AccountMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(uri)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create()', () => {
    test('Should return an account on success', async () => {
      const sut = makeSut()
      const createAccountParams = mockAccountParams()
      const isValid = await sut.create(createAccountParams)
      expect(isValid).toBe(true)
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on success', async () => {
      const sut = makeSut()
      const createAccountParams = mockAccountParams()
      await accountCollection.insertOne(createAccountParams)
      const account = await sut.loadByEmail(createAccountParams.email)
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(createAccountParams.name)
      expect(account?.password).toBe(createAccountParams.password)
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(faker.internet.email())
      expect(account).toBeFalsy()
    })
  })

  describe('checkByEmail()', () => {
    test('Should return true if email is valid', async () => {
      const sut = makeSut()
      const createAccountParams = mockAccountParams()
      await accountCollection.insertOne(createAccountParams)
      const exists = await sut.checkByEmail(createAccountParams.email)
      expect(exists).toBe(true)
    })

    test('Should return false if email is not valid', async () => {
      const sut = makeSut()
      const exists = await sut.checkByEmail(faker.internet.email())
      expect(exists).toBe(false)
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne(mockAccountParams())
      const fakeAccount = await accountCollection.findOne({ _id: res.insertedId })
      expect(fakeAccount?.accessToken).toBeFalsy()
      const accessToken = faker.string.uuid()
      await sut.updateAccessToken(fakeAccount!._id.toHexString(), accessToken)
      const account = await accountCollection.findOne({ _id: fakeAccount?._id })
      expect(account).toBeTruthy()
      expect(account?.accessToken).toBe(accessToken)
    })
  })

  describe('loadByToken()', () => {
    let name = faker.person.firstName()
    let email = faker.internet.email()
    let password = faker.internet.password()
    let accessToken = faker.string.uuid()

    beforeEach(() => {
      name = faker.person.firstName()
      email = faker.internet.email()
      password = faker.internet.password()
      accessToken = faker.string.uuid()
    })

    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken
      })
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
    })

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin'
      })
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken
      })
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken with if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin'
      })
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeFalsy()
    })
  })
})

describe('MongoHelper', () => {
  const uri: string = process.env.MONGO_URL ?? 'mongodb://localhost:27017/test';

  beforeAll(async () => {
    await MongoHelper.connect(uri);
  });

  beforeEach(() => {
    MongoHelper.connect = jest.fn() as jest.MockedFunction<typeof MongoHelper.connect>;
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
    if (MongoHelper.client) {
      await MongoHelper.client.close();
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('disconnect()', () => {
    test('Should call close on client', async () => {
      const closeMock = jest.fn().mockResolvedValue(Promise.resolve())
      MongoHelper.client = { close: closeMock } as unknown as MongoClient;
      await MongoHelper.disconnect();
      expect(closeMock).toHaveBeenCalledTimes(1);
      expect(MongoHelper.client).toBeNull();
    });

    test('Should not throw error if client is null', async () => {
      MongoHelper.client = null as any;
      await expect(MongoHelper.disconnect()).resolves.toBeUndefined();
    });
  });

  describe('getCollection()', () => {
    test('Should throw an error if client is not connected', () => {
      MongoHelper.client = null as any; // Usando `any` para evitar problemas de tipo
      expect(() => MongoHelper.getCollection('any_collection')).toThrow(new Error('Client is not connected'));
    });
  });

  describe('mapCollection()', () => {
    test('Should call map for each document in the collection', () => {
      const document1 = { _id: new ObjectId(), name: 'John Doe', email: 'john@example.com', password: 'password' };
      const document2 = { _id: new ObjectId(), name: 'Jane Doe', email: 'jane@example.com', password: 'password' };
      const collection = [document1, document2];
      const mapSpy = jest.spyOn(MongoHelper, 'map');
      MongoHelper.mapCollection(collection);
      expect(mapSpy).toHaveBeenCalledTimes(2);
      expect(mapSpy).toHaveBeenCalledWith(document1);
      expect(mapSpy).toHaveBeenCalledWith(document2);
    });
  });
});
