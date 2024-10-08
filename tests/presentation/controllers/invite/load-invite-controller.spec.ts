import { LoadInviteController, LoadInviteControllerParams } from '@/presentation/controllers'
import { MissingParamError, NotFoundError } from '@/presentation/errors'
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers'
import { LoadInviteSpy, throwError } from '@/tests/domain/mocks'
import { ValidationSpy } from '@/tests/presentation/mocks'

import { faker } from '@faker-js/faker'

const mockRequest = (): LoadInviteControllerParams => ({
  inviteCode: faker.lorem.word()
})

type SutTypes = {
  sut: LoadInviteController
  validationSpy: ValidationSpy
  loadInviteSpy: LoadInviteSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const loadInviteSpy = new LoadInviteSpy()
  const sut = new LoadInviteController(validationSpy, loadInviteSpy)
  return { sut, validationSpy, loadInviteSpy }
}

describe('LoadInviteController', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  it('should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.lorem.word())
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  it('should call LoadInvite with correct params', async () => {
    const { sut, loadInviteSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadInviteSpy.callsCount).toBe(1)
    expect(loadInviteSpy.params).toEqual(request)
  })

  it('should returns 500 if LoadInvite throws', async () => {
    const { sut, loadInviteSpy } = makeSut()
    jest.spyOn(loadInviteSpy, 'load').mockImplementationOnce(throwError)
    const request = mockRequest()
    const promise = await sut.handle(request)
    expect(promise).toEqual(serverError(new Error()))
  })

  it('should returns 404 if LoadInvite returns null', async () => {
    const { sut, loadInviteSpy } = makeSut()
    jest.spyOn(loadInviteSpy, 'load').mockResolvedValueOnce(null)
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(notFound(new NotFoundError()))
  })

  it('should returns 200 on success', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(
      ok({
        inviteId: 'any_invite_id',
        accountId: 'any_account_id',
        inviteCode: 'any_invite_code',
        emailUser: 'any_email@user.com',
        phoneUser: '1234567890',
        status: 'active',
        expiration: new Date('2025-01-29T01:29:12.841Z'),
        usedAt: null
      })
    )
  })
})
