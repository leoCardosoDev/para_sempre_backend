import { DbUpdateInvite } from '@/application/usecases/invite'
import { UpdateInviteParams } from '@/domain/usecases'
import { LoadInviteByCodeRepositorySpy } from '@/tests/application/mocks'
import { throwError } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbUpdateInvite
  loadInviteByCodeRepositorySpy: LoadInviteByCodeRepositorySpy
}

const mockInviteCode = (): UpdateInviteParams => ({
  inviteCode: faker.lorem.word(),
  status: faker.lorem.word(),
  expiration: new Date(),
  usedAt: new Date()
})

const makeSut = (): SutTypes => {
  const loadInviteByCodeRepositorySpy = new LoadInviteByCodeRepositorySpy()
  const sut = new DbUpdateInvite(loadInviteByCodeRepositorySpy)
  return { sut, loadInviteByCodeRepositorySpy }
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
})
