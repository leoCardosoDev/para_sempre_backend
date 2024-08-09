import { DbCreateAccount } from '@/application/usecases'
import { mockAccountParams, throwError } from '@/tests/domain/mocks'
import { HasherSpy, CreateAccountRepositorySpy, CheckAccountByEmailRepositorySpy } from '@/tests/application/mocks'

type SutTypes = {
  sut: DbCreateAccount
  hasherSpy: HasherSpy
  createAccountRepositorySpy: CreateAccountRepositorySpy
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkAccountByEmailRepositorySpy = new CheckAccountByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const createAccountRepositorySpy = new CreateAccountRepositorySpy()
  const sut = new DbCreateAccount(hasherSpy, createAccountRepositorySpy, checkAccountByEmailRepositorySpy)
  return {
    sut,
    hasherSpy,
    createAccountRepositorySpy,
    checkAccountByEmailRepositorySpy
  }
}

describe('DbCreateAccount Usecase', () => {
  it('Should call Hasher with correct plaintext', async () => {
    const { sut, hasherSpy } = makeSut()
    const addAccountParams = mockAccountParams()
    await sut.create(addAccountParams)
    expect(hasherSpy.plaintext).toBe(addAccountParams.password)
  })

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError)
    const promise = sut.create(mockAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('Should call CreateAccountRepository with correct values', async () => {
    const { sut, createAccountRepositorySpy, hasherSpy } = makeSut()
    const addAccountParams = mockAccountParams()
    await sut.create(addAccountParams)
    expect(createAccountRepositorySpy.params).toEqual({
      name: addAccountParams.name,
      email: addAccountParams.email,
      password: hasherSpy.digest
    })
  })

  it('Should throw if CreateAccountRepository throws', async () => {
    const { sut, createAccountRepositorySpy } = makeSut()
    jest.spyOn(createAccountRepositorySpy, 'create').mockImplementationOnce(throwError)
    const promise = sut.create(mockAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('Should return true on success', async () => {
    const { sut } = makeSut()
    const isValid = await sut.create(mockAccountParams())
    expect(isValid).toBe(true)
  })

  it('Should return false if CreateAccountRepository returns false', async () => {
    const { sut, createAccountRepositorySpy } = makeSut()
    createAccountRepositorySpy.result = false
    const isValid = await sut.create(mockAccountParams())
    expect(isValid).toBe(false)
  })

  it('Should return false if CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    checkAccountByEmailRepositorySpy.result = true
    const isValid = await sut.create(mockAccountParams())
    expect(isValid).toBe(false)
  })

  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    const addAccountParams = mockAccountParams()
    await sut.create(addAccountParams)
    expect(checkAccountByEmailRepositorySpy.email).toBe(addAccountParams.email)
  })
})
