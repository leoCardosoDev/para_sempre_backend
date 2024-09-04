import { faker } from '@faker-js/faker'
import { ValidationSpy } from '@/tests/presentation/mocks'
import { LoadInviteSpy } from '@/tests/domain/mocks'
import { UpdateInviteController, UpdateInviteControllerParams } from '@/presentation/controllers'

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
  const sut = new UpdateInviteController(validationSpy)
  return { sut, validationSpy, loadInviteSpy }
}

describe('CreateInvite Controller', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })
})
