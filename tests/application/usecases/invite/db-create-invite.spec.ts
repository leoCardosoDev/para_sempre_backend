import { CreateInviteParams } from '@/domain/usecases/invite'
import { DbCreateInvite } from '@/application/usecases/invite'
import { CreateInviteRepositorySpy, EncrypterSpy } from '@/tests/application/mocks'
import { faker } from '@faker-js/faker'
import { throwError } from '@/tests/domain/mocks'

const mockInviteData = (): CreateInviteParams => ({
  accountId: faker.string.uuid(),
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

type SutTypes = {
  sut: DbCreateInvite
  createInviteRepositorySpy: CreateInviteRepositorySpy
  encrypterSpy: EncrypterSpy
}

const makeSut = (): SutTypes => {
  const createInviteRepositorySpy = new CreateInviteRepositorySpy()
  const encrypterSpy = new EncrypterSpy()
  const sut = new DbCreateInvite(createInviteRepositorySpy, encrypterSpy)
  return {
    sut,
    createInviteRepositorySpy,
    encrypterSpy
  }
}

describe('DbCreateInvite Usecase', () => {
  it('should call CreateInviteRepository with correct values', async () => {
    const { sut, createInviteRepositorySpy, encrypterSpy } = makeSut()
    const createSpy = jest.spyOn(createInviteRepositorySpy, 'createInvite')
    const inviteData = mockInviteData()
    await sut.create(inviteData)
    expect(createSpy).toHaveBeenCalledWith({
      ...inviteData,
      inviteCode: encrypterSpy.ciphertext // mockado no EncrypterSpy
    })
  })

  it('should throw if CreateInviteRepository throws', async () => {
    const { sut, createInviteRepositorySpy } = makeSut()
    jest.spyOn(createInviteRepositorySpy, 'createInvite').mockImplementationOnce(throwError)
    const inviteData = mockInviteData()
    const promise = sut.create(inviteData)
    await expect(promise).rejects.toThrow()
  })

  it('should call Encrypter with correct emailUser', async () => {
    const { sut, encrypterSpy } = makeSut()
    const encryptSpy = jest.spyOn(encrypterSpy, 'encrypt')
    const inviteData = mockInviteData()
    await sut.create(inviteData)
    expect(encryptSpy).toHaveBeenCalledWith(inviteData.emailUser)
  })

  it('should return true on success', async () => {
    const { sut } = makeSut()
    const inviteData = mockInviteData()
    const result = await sut.create(inviteData)
    expect(result).toEqual({
      inviteCode: inviteData.inviteCode,
      status: inviteData.status,
      expiration: inviteData.expiration
    })
  })
})
