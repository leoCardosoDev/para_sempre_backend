import { LoadInviteController, LoadInviteControllerParams } from '@/presentation/controllers'
import { faker } from '@faker-js/faker'
import { ValidationSpy } from '@/tests/presentation/mocks'

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
})
