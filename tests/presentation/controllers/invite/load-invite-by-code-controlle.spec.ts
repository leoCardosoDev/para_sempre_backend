import { LoadInviteByCodeController, LoadInviteByCodeControllerParams } from '@/presentation/controllers/invite'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers'
import { LoadByCodeInviteSpy, throwError } from '@/tests/domain/mocks'
import { ValidationSpy } from '@/tests/presentation/mocks'

import { faker } from '@faker-js/faker'

const mockRequest = (): LoadInviteByCodeControllerParams => ({
  inviteCode: faker.string.uuid()
})

type SutTypes = {
  sut: LoadInviteByCodeController
  validationSpy: ValidationSpy
  loadByCodeInviteSpy: LoadByCodeInviteSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const loadByCodeInviteSpy = new LoadByCodeInviteSpy()
  const sut = new LoadInviteByCodeController(validationSpy, loadByCodeInviteSpy)
  return {
    sut,
    validationSpy,
    loadByCodeInviteSpy
  }
}

describe('LoadByCodeInvite Controller', () => {
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

  it('should returns 500 if LoadByCodeInvite throws', async () => {
    const { sut, loadByCodeInviteSpy } = makeSut()
    jest.spyOn(loadByCodeInviteSpy, 'load').mockImplementationOnce(throwError)
    const request = mockRequest()
    const promise = await sut.handle(request)
    expect(promise).toEqual(serverError(new Error()))
  })

  it('should returns 200 on success', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(
      ok({
        accountId: 'any_account_id',
        inviteCode: 'any_invite_code',
        emailUser: 'any_email@mail.com',
        phoneUser: 'any_phone_user',
        status: 'any_status',
        expiration: new Date('2025-01-29T01:29:12.841Z')
      })
    )
  })
})
