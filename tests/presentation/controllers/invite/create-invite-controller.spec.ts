import { CreateInviteController, CreateInviteControllerParams } from '@/presentation/controllers'
import { faker } from '@faker-js/faker'
import { ValidationSpy } from '@/tests/presentation/mocks'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, serverError } from '@/presentation/helpers'
import { CreateInviteSpy, throwError } from '@/tests/domain/mocks'

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
})
