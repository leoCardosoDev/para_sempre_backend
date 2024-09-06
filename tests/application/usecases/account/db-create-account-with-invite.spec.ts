import { DbCreateAccountWithInvite } from '@/application/usecases'
import { mockAccountWithInviteParams, throwError } from '@/tests/domain/mocks'
import { CheckEmailRepositorySpy, CreateAccountWithInviteRepositorySpy, HasherSpy, LoadInviteByCodeRepositorySpy } from '@/tests/application/mocks'

const mockInviteResult = () => ({
  inviteId: 'last_invite_id',
  accountId: 'any_account_id',
  inviteCode: 'any_invite_code',
  emailUser: 'any_email@user.com',
  phoneUser: '1234567890',
  status: 'active',
  expiration: new Date('2025-01-29T01:29:12.841Z'),
  usedAt: null
})

type SutTypes = {
  sut: DbCreateAccountWithInvite
  loadInviteByCodeRepository: LoadInviteByCodeRepositorySpy
  checkEmailRepositorySpy: CheckEmailRepositorySpy
  hasherSpy: HasherSpy
  createAccountWithInviteRepositorySpy: CreateAccountWithInviteRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadInviteByCodeRepository = new LoadInviteByCodeRepositorySpy()
  const checkEmailRepositorySpy = new CheckEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const createAccountWithInviteRepositorySpy = new CreateAccountWithInviteRepositorySpy()
  const sut = new DbCreateAccountWithInvite(loadInviteByCodeRepository, checkEmailRepositorySpy, hasherSpy, createAccountWithInviteRepositorySpy)
  return { sut, loadInviteByCodeRepository, checkEmailRepositorySpy, hasherSpy, createAccountWithInviteRepositorySpy }
}

describe('DbCreateAccountWithInvite Usecases', () => {
  it('should call LoadInviteByCodeRepository with correct values', async () => {
    const { sut, loadInviteByCodeRepository } = makeSut()
    const addParams = mockAccountWithInviteParams()
    await sut.create(addParams)
    expect(loadInviteByCodeRepository.inviteCode).toEqual(addParams.inviteCode)
  })

  it('should throw if LoadInviteByCodeRepository throws', async () => {
    const { sut, loadInviteByCodeRepository } = makeSut()
    jest.spyOn(loadInviteByCodeRepository, 'loadByCode').mockImplementationOnce(throwError)
    const addParams = mockAccountWithInviteParams()
    const promise = sut.create(addParams)
    await expect(promise).rejects.toThrow()
  })

  it('should return false if LoadInviteByCodeRepository return an invalid invite', async () => {
    const { sut, loadInviteByCodeRepository } = makeSut()
    jest.spyOn(loadInviteByCodeRepository, 'loadByCode').mockResolvedValueOnce(null)
    const addParams = mockAccountWithInviteParams()
    const result = await sut.create(addParams)
    expect(result).toEqual({ success: false, error: 'Invalid invite code' })
  })

  it('should return false if LoadInviteByCodeRepository return an invalid actived invite', async () => {
    const { sut, loadInviteByCodeRepository } = makeSut()
    const mockInactiveStatus = { ...mockInviteResult(), status: 'used' }
    jest.spyOn(loadInviteByCodeRepository, 'loadByCode').mockResolvedValueOnce(mockInactiveStatus)
    const addParams = mockAccountWithInviteParams()
    const result = await sut.create(addParams)
    expect(result).toEqual({ success: false, error: 'Used invite code' })
  })

  it('should return false if email does match', async () => {
    const { sut, loadInviteByCodeRepository } = makeSut()
    const mockDifferentEmail = { ...mockInviteResult(), emailUser: 'different_email@example.com' }
    jest.spyOn(loadInviteByCodeRepository, 'loadByCode').mockResolvedValueOnce(mockDifferentEmail)
    const addParams = mockAccountWithInviteParams()
    const result = await sut.create(addParams)
    expect(result).toEqual({ success: false, error: 'Email does not match the invite' })
  })

  it('should call CheckEmailRepository with correct values', async () => {
    const { sut, loadInviteByCodeRepository, checkEmailRepositorySpy } = makeSut()
    const addParams = { ...mockAccountWithInviteParams(), email: 'same_email@mail.com' }
    jest.spyOn(loadInviteByCodeRepository, 'loadByCode').mockResolvedValueOnce({ ...mockInviteResult(), emailUser: 'same_email@mail.com' })
    const checkByEmailSpy = jest.spyOn(checkEmailRepositorySpy, 'checkByEmail')
    await sut.create(addParams)
    expect(checkByEmailSpy).toHaveBeenCalledWith(addParams.email)
    expect(checkByEmailSpy).toHaveBeenCalledTimes(1)
  })

  it('should return false if CheckEmailRepository return true', async () => {
    const { sut, loadInviteByCodeRepository, checkEmailRepositorySpy } = makeSut()
    const addParams = { ...mockAccountWithInviteParams(), email: 'same_email@mail.com' }
    jest.spyOn(loadInviteByCodeRepository, 'loadByCode').mockResolvedValueOnce({ ...mockInviteResult(), emailUser: 'same_email@mail.com' })
    jest.spyOn(checkEmailRepositorySpy, 'checkByEmail').mockReturnValueOnce(new Promise(resolve => resolve(true)))
    const result = await sut.create(addParams)
    expect(result).toEqual({ success: false, error: 'Email already registered' })
  })

  it('Should call Hasher with correct plaintext', async () => {
    const { sut, loadInviteByCodeRepository, hasherSpy } = makeSut()
    const addParams = { ...mockAccountWithInviteParams(), email: 'same_email@mail.com' }
    jest.spyOn(loadInviteByCodeRepository, 'loadByCode').mockResolvedValueOnce({ ...mockInviteResult(), emailUser: 'same_email@mail.com' })
    await sut.create(addParams)
    expect(hasherSpy.plaintext).toBe(addParams.password)
  })

  it('Should throw if Hasher throws', async () => {
    const { sut, loadInviteByCodeRepository, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError)
    const addParams = { ...mockAccountWithInviteParams(), email: 'same_email@mail.com' }
    jest.spyOn(loadInviteByCodeRepository, 'loadByCode').mockResolvedValueOnce({ ...mockInviteResult(), emailUser: 'same_email@mail.com' })
    const promise = sut.create(addParams)
    await expect(promise).rejects.toThrow()
  })

  it('Should call CreateAccountWithInviteRepository with correct values', async () => {
    const { sut, loadInviteByCodeRepository, createAccountWithInviteRepositorySpy, hasherSpy } = makeSut()
    const addParams = { ...mockAccountWithInviteParams(), email: 'same_email@mail.com' }
    jest.spyOn(loadInviteByCodeRepository, 'loadByCode').mockResolvedValueOnce({ ...mockInviteResult(), emailUser: 'same_email@mail.com' })
    await sut.create(addParams)
    expect(createAccountWithInviteRepositorySpy.params).toEqual({
      name: addParams.name,
      email: addParams.email,
      password: hasherSpy.digest,
      inviteId: loadInviteByCodeRepository.inviteId
    })
  })
})
