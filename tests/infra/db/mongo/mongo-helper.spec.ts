import { MongoHelper as sut } from "@/infra/db"
import { MongoClient, ObjectId } from "mongodb"

describe('MongoHelper', () => {
  const uri: string = process.env.MONGO_URL ?? 'mongodb://localhost:27017/test'

  beforeAll(async () => {
    await sut.connect(uri);
  });

  beforeEach(() => {
    sut.connect = jest.fn() as jest.MockedFunction<typeof sut.connect>
  });

  afterAll(async () => {
    await sut.disconnect();
    if (sut.client) {
      await sut.client.close();
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('disconnect()', () => {

    test('Should call close on client', async () => {
      const closeMock = jest.fn().mockResolvedValue(Promise.resolve())
      sut.client = { close: closeMock } as unknown as MongoClient
      await sut.disconnect();
      expect(closeMock).toHaveBeenCalledTimes(1);
      expect(sut.client).toBeNull();
    });

    test('Should not throw error if client is null', async () => {
      sut.client = null as any;
      await expect(sut.disconnect()).resolves.toBeUndefined();
    });
  });

  describe('getCollection()', () => {
    test('Should throw an error if client is not connected', () => {
      sut.client = null as any
      expect(() => sut.getCollection('any_collection')).toThrow(new Error('Client is not connected'))
    });
  });

  describe('mapCollection()', () => {
    test('Should call map for each document in the collection', () => {
      const document1 = { _id: new ObjectId(), name: 'John Doe', email: 'john@example.com', password: 'password' };
      const document2 = { _id: new ObjectId(), name: 'Jane Doe', email: 'jane@example.com', password: 'password' };
      const collection = [document1, document2];
      const mapSpy = jest.spyOn(sut, 'map');
      sut.mapCollection(collection);
      expect(mapSpy).toHaveBeenCalledTimes(2);
      expect(mapSpy).toHaveBeenCalledWith(document1);
      expect(mapSpy).toHaveBeenCalledWith(document2);
    });
  });
});
