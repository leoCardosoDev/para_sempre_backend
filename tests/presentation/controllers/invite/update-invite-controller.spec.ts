import { faker } from '@faker-js/faker'
import { ValidationSpy } from '@/tests/presentation/mocks'
import { LoadInviteSpy } from '@/tests/domain/mocks'
import { UpdateInviteController, UpdateInviteControllerParams } from '@/presentation/controllers'
import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'

const mockRequest = (): UpdateInviteControllerParams => ({
  inviteCode: faker.string.uuid(),
  status: faker.word.sample(),
  createdAt: faker.date.past().toISOString(),
  expiration: faker.date.future().toISOString(),
  usedAt: faker.date.recent().toISOString()
})

type SutTypes = {
  sut: UpdateInviteController
  validationSpy: ValidationSpy
  loadInviteSpy: LoadInviteSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const loadInviteSpy = new LoadInviteSpy()
  const sut = new UpdateInviteController(validationSpy, loadInviteSpy)
  return { sut, validationSpy, loadInviteSpy }
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

  it('should call LoadInvite with correct params', async () => {
    const { sut, loadInviteSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadInviteSpy.callsCount).toBe(1)
    expect(loadInviteSpy.params).toEqual(request)
  })
})
