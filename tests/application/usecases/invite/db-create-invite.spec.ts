import { CreateInviteParams } from '@/domain/usecases/invite'
import { DbCreateInvite } from '@/application/usecases/invite'
import { CreateInviteRepositorySpy } from '@/tests/application/mocks'
import { faker } from '@faker-js/faker'

const mockInviteData = (): CreateInviteParams => ({
  accountId: faker.string.uuid(),
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

type SutTypes = {
  sut: DbCreateInvite
  createInviteRepositorySpy: CreateInviteRepositorySpy
}

const makeSut = (): SutTypes => {
  const createInviteRepositorySpy = new CreateInviteRepositorySpy()
  const sut = new DbCreateInvite(createInviteRepositorySpy)
  return {
    sut,
    createInviteRepositorySpy
  }
}

describe('DbCreateInvite Usecase', () => {
  it('should call CreateInviteRepository with correct values', async () => {
    const { sut, createInviteRepositorySpy } = makeSut()
    const createSpy = jest.spyOn(createInviteRepositorySpy, 'createInvite')
    const inviteData = mockInviteData()
    await sut.create(inviteData)
    expect(createSpy).toHaveBeenCalledWith({
      ...inviteData
    })
  })
})
