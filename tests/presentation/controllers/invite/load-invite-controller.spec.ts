import { LoadInviteController, LoadInviteControllerParams } from '@/presentation/controllers'
import { faker } from '@faker-js/faker'
import { ValidationSpy } from '@/tests/presentation/mocks'
import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'

const mockRequest = (): LoadInviteControllerParams => ({
  inviteCode: faker.lorem.word()
})

type SutTypes = {
  sut: LoadInviteController
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = new LoadInviteController(validationSpy)
  return { sut, validationSpy }
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
})
