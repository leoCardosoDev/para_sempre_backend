import { CreateInviteParams } from '@/domain/usecases/invite'
import { DbCreateInvite } from '@/application/usecases/invite'
import { CreateInviteRepositorySpy, InviteCodeGeneratorSpy } from '@/tests/application/mocks'
import { faker } from '@faker-js/faker'

const mockInviteData = (): CreateInviteParams => ({
  accountId: faker.string.uuid(),
  inviteCode: 'unique_invite_code',
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
  inviteCodeGenaratorSpy: InviteCodeGeneratorSpy
}

const makeSut = (): SutTypes => {
  const createInviteRepositorySpy = new CreateInviteRepositorySpy()
  const inviteCodeGenaratorSpy = new InviteCodeGeneratorSpy()
  const sut = new DbCreateInvite(createInviteRepositorySpy, inviteCodeGenaratorSpy)
  return {
    sut,
    createInviteRepositorySpy,
    inviteCodeGenaratorSpy
  }
}

describe('DbCreateInvite Usecase', () => {
  it('should generate a unique inviteCode and pass it to CreateInviteRepository', async () => {
    const { sut, inviteCodeGenaratorSpy, createInviteRepositorySpy } = makeSut()
    const inviteCode = 'unique_invite_code'
    inviteCodeGenaratorSpy.generate.mockResolvedValue(inviteCode)
    const inviteData = mockInviteData()
    const expectedInviteData = { ...inviteData, inviteCode }
    const createSpy = jest.spyOn(createInviteRepositorySpy, 'createInvite')
    await sut.create(inviteData)
    expect(inviteCodeGenaratorSpy.generate).toHaveBeenCalledTimes(1)
    expect(createSpy).toHaveBeenCalledWith(expectedInviteData)
  })

  it('should call CreateInviteRepository with correct values', async () => {
    const { sut, createInviteRepositorySpy, inviteCodeGenaratorSpy } = makeSut()
    const inviteCode = 'unique_invite_code'
    inviteCodeGenaratorSpy.generate.mockResolvedValue(inviteCode)
    const createSpy = jest.spyOn(createInviteRepositorySpy, 'createInvite')
    const inviteData = mockInviteData()
    await sut.create(inviteData)
    expect(createSpy).toHaveBeenCalledWith({
      ...inviteData,
      inviteCode
    })
  })
})
