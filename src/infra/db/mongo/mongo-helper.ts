import { MongoClient, Collection, Document } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient | null,
  uri: null as unknown as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null as unknown as MongoClient
    }
    return Promise.resolve()
  },

  getCollection(name: string): Collection<Document> {
    if (!this.client) {
      throw new Error('Client is not connected')
    }
    return this.client.db().collection(name)
  },

  map: <T extends Document>(data: T): any => {
    const { _id, ...rest } = data
    return { ...rest, id: _id.toHexString() }
  },

  mapCollection: <T extends Document>(collection: T[]): any[] => {
    return collection.map(c => MongoHelper.map(c))
  }
}
