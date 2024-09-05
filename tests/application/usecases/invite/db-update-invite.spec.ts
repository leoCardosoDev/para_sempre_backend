import { DbUpdateInvite } from '@/application/usecases/invite'
import { UpdateInviteParams } from '@/domain/usecases'
import { LoadInviteByCodeRepositorySpy, UpdateInviteRepositorySpy } from '@/tests/application/mocks'
import { throwError } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbUpdateInvite
  loadInviteByCodeRepositorySpy: LoadInviteByCodeRepositorySpy
  updateInviteRepositorySpy: UpdateInviteRepositorySpy
}

const mockInviteCode = (): UpdateInviteParams => ({
  inviteCode: faker.lorem.word(),
  status: faker.lorem.word(),
  expiration: new Date(),
  usedAt: new Date(),
  emailUser: faker.internet.email(),
  phoneUser: faker.string.numeric({ length: { min: 10, max: 12 } }),
  inviteType: faker.word.sample(),
  maxUses: faker.number.int({ min: 0, max: 1 })
})

const mockInviteResult = (): any => ({
  inviteId: 'any_invite_id',
  accountId: 'any_account_id',
  inviteCode: 'any_invite_code',
  emailUser: 'any_email@user.com',
  phoneUser: '1234567890',
  status: 'active',
  expiration: new Date('2025-01-29T01:29:12.841Z'),
  usedAt: null
})

const makeSut = (): SutTypes => {
  const loadInviteByCodeRepositorySpy = new LoadInviteByCodeRepositorySpy()
  const updateInviteRepositorySpy = new UpdateInviteRepositorySpy()
  const sut = new DbUpdateInvite(loadInviteByCodeRepositorySpy, updateInviteRepositorySpy)
  return { sut, loadInviteByCodeRepositorySpy, updateInviteRepositorySpy }
}

describe('DbLoadInvite Usecases', () => {
  let params: UpdateInviteParams
  beforeEach(() => {
    params = mockInviteCode()
  })

  it('should calls LoadInviteByCodeRepository with correct values', async () => {
    const { sut, loadInviteByCodeRepositorySpy } = makeSut()
    const loadByCodeSpy = jest.spyOn(loadInviteByCodeRepositorySpy, 'loadByCode')
    await sut.update(params)
    expect(loadByCodeSpy).toHaveBeenCalledWith(params.inviteCode)
    expect(loadByCodeSpy).toHaveBeenCalledTimes(1)
  })

  it('should return false if LoadInviteByCodeRepository return null', async () => {
    const { sut, loadInviteByCodeRepositorySpy } = makeSut()
    jest.spyOn(loadInviteByCodeRepositorySpy, 'loadByCode').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const result = await sut.update(params)
    expect(result).toBe(false)
  })

  it('should throw if LoadInviteByCodeRepository throws', async () => {
    const { sut, loadInviteByCodeRepositorySpy } = makeSut()
    jest.spyOn(loadInviteByCodeRepositorySpy, 'loadByCode').mockImplementationOnce(throwError)
    const promise = sut.update(params)
    await expect(promise).rejects.toThrow()
  })

  it('should calls UpdateInviteRepository with correct values', async () => {
    const { sut, loadInviteByCodeRepositorySpy, updateInviteRepositorySpy } = makeSut()
    const updateBySpy = jest.spyOn(updateInviteRepositorySpy, 'updateByCode')
    jest.spyOn(loadInviteByCodeRepositorySpy, 'loadByCode').mockResolvedValueOnce(mockInviteResult())
    await sut.update(params)
    expect(updateBySpy).toHaveBeenCalledTimes(1)
    expect(updateBySpy).toHaveBeenCalledWith(params)
  })

  it('should throw if UpdateInviteRepository throws', async () => {
    const { sut, loadInviteByCodeRepositorySpy, updateInviteRepositorySpy } = makeSut()
    jest.spyOn(updateInviteRepositorySpy, 'updateByCode').mockImplementationOnce(throwError)
    jest.spyOn(loadInviteByCodeRepositorySpy, 'loadByCode').mockResolvedValueOnce(mockInviteResult())
    const promise = sut.update(params)
    await expect(promise).rejects.toThrow()
  })

  it('should return false on result', async () => {
    const { sut, loadInviteByCodeRepositorySpy, updateInviteRepositorySpy } = makeSut()
    jest.spyOn(loadInviteByCodeRepositorySpy, 'loadByCode').mockResolvedValueOnce(mockInviteResult())
    jest.spyOn(updateInviteRepositorySpy, 'updateByCode').mockResolvedValueOnce(false)
    const result = await sut.update(params)
    expect(result).toBe(false)
  })

  it('should return true on result', async () => {
    const { sut, loadInviteByCodeRepositorySpy } = makeSut()
    jest.spyOn(loadInviteByCodeRepositorySpy, 'loadByCode').mockResolvedValueOnce(mockInviteResult())
    const result = await sut.update(params)
    expect(result).toBe(true)
  })
})
