import { CreateInviteController, CreateInviteControllerParams } from '@/presentation/controllers/invite'
import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'
import { ValidationSpy } from '@/tests/presentation/mocks'

import { faker } from '@faker-js/faker'

const mockRequest = (): CreateInviteControllerParams => ({
    invite_id: faker.string.uuid(),
    admin_id: faker.string.uuid(),
    invite_code: faker.string.uuid(),
    email_user: faker.internet.email(),
    phone_user: faker.string.numeric({ length: { min: 10, max: 12 }}),
    status: faker.word.sample(),
    invite_type: faker.word.sample(),
    created_at: faker.date.recent(),
    expiration: faker.date.future(),
    used_at: null,
    max_uses: faker.number.int({min: 0, max: 1})
})

type SutTypes = {
  sut: CreateInviteController,
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = new CreateInviteController(validationSpy)
  return {
    sut,
    validationSpy
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
})
