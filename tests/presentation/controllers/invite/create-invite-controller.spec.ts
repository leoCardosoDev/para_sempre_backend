import { CreateInvite } from '@/domain/usecases/invite'
import { CreateInviteController, CreateInviteControllerParams } from '@/presentation/controllers/invite'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'
import { ValidationSpy } from '@/tests/presentation/mocks'
import { CreateInviteSpy } from '@/tests/domain/mocks'

import { faker } from '@faker-js/faker'

const mockRequest = (expirationDate?: Date, accountId?: string): CreateInviteControllerParams => ({
  accountId: accountId || faker.string.uuid(),
  inviteCode: faker.string.uuid(),
  emailUser: faker.internet.email(),
  phoneUser: faker.string.numeric({ length: { min: 10, max: 12 }}),
  status: faker.word.sample(),
  inviteType: faker.word.sample(),
  createdAt: faker.date.recent(),
  expiration: expirationDate || faker.date.future(),
  usedAt: null,
  maxUses: faker.number.int({ min: 0, max: 1 }),
})

type SutTypes = {
  sut: CreateInviteController,
  validationSpy: ValidationSpy,
  createInviteSpy: CreateInvite
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const createInviteSpy = new CreateInviteSpy()
  const sut = new CreateInviteController(validationSpy, createInviteSpy)
  return {
    sut,
    validationSpy,
    createInviteSpy
  }
}

describe('CreateInvite Controller', () => {
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

  it('should return 400 if expiration date is earlier than createdAt date', async () => {
    const { sut } = makeSut()
    const pastDate = faker.date.past()
    const request = mockRequest(pastDate)
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('expiration must be greater than createdAt')))
  })

  it('should call CreateInvite with correct values', async () => {
    const { sut, createInviteSpy } = makeSut()
    const createSpy = jest.spyOn(createInviteSpy, 'create')
    const request = mockRequest()
    await sut.handle(request)
    expect(createSpy).toHaveBeenCalledWith({...request, usedAt: null})
  })

  it('should returns 500 if CreateInvite throws', async () => {
    const { sut, createInviteSpy } = makeSut()
    jest.spyOn(createInviteSpy, 'create').mockImplementationOnce(throwError)
    const request = mockRequest()
    const promise = await sut.handle(request)
    expect(promise).toEqual(serverError(new Error()))
  })

  it('should returns 200 on success', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(true))
  })
})
