import { EmailInUseError, InvalidExpirationDateError } from '@/domain/errors'
import { CreateInviteController, CreateInviteControllerParams } from '@/presentation/controllers'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers'
import { CreateInviteSpy, throwError } from '@/tests/domain/mocks'
import { ValidationSpy } from '@/tests/presentation/mocks'

import { faker } from '@faker-js/faker'

const mockRequest = (expirationDate?: string, accountId?: string): CreateInviteControllerParams => ({
  accountId: accountId || faker.string.uuid(),
  inviteCode: faker.string.uuid(),
  emailUser: faker.internet.email(),
  phoneUser: faker.string.numeric({ length: { min: 10, max: 12 } }),
  status: faker.word.sample(),
  inviteType: faker.word.sample(),
  createdAt: faker.date.recent().toISOString(),
  expiration: expirationDate || faker.date.future().toISOString(),
  usedAt: undefined,
  maxUses: faker.number.int({ min: 0, max: 1 })
})

type SutTypes = {
  sut: CreateInviteController
  validationSpy: ValidationSpy
  createInviteSpy: CreateInviteSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const createInviteSpy = new CreateInviteSpy()
  const sut = new CreateInviteController(validationSpy, createInviteSpy)
  return { sut, validationSpy, createInviteSpy }
}

describe('CreateInvite Controller', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  it('should returns 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.lorem.word())
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  it('should call CreateInvite with correct values', async () => {
    const { sut, createInviteSpy } = makeSut()
    const createSpy = jest.spyOn(createInviteSpy, 'create')
    const request = mockRequest()
    await sut.handle(request)
    expect(createSpy).toHaveBeenCalledWith({
      ...request,
      accountId: request.accountId,
      createdAt: new Date(request.createdAt),
      expiration: new Date(request.expiration),
      usedAt: request.usedAt ? new Date(request.usedAt) : null
    })
  })

  it('should returns 500 if CreateInvite throws', async () => {
    const { sut, createInviteSpy } = makeSut()
    jest.spyOn(createInviteSpy, 'create').mockImplementationOnce(throwError)
    const request = mockRequest()
    const promise = await sut.handle(request)
    expect(promise).toEqual(serverError(new Error()))
  })

  it('should return 400 if CreateInvite throws EmailInUseError', async () => {
    const { sut, createInviteSpy } = makeSut()
    const request = mockRequest()
    jest.spyOn(createInviteSpy, 'create').mockImplementationOnce(() => {
      throw new EmailInUseError()
    })
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new EmailInUseError()))
  })

  it('should return 400 if CreateInvite throws InvalidExpirationDateError', async () => {
    const { sut, createInviteSpy } = makeSut()
    const request = mockRequest()
    jest.spyOn(createInviteSpy, 'create').mockImplementationOnce(() => {
      throw new InvalidExpirationDateError()
    })
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new InvalidExpirationDateError()))
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
        inviteType: 'event',
        createdAt: new Date('2024-09-03T21:15:45.224Z').toISOString(),
        expiration: new Date('2024-09-03T21:16:18.671Z').toISOString(),
        usedAt: null,
        maxUses: 1
      })
    )
  })
})
