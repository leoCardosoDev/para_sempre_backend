import { CreateInviteController } from '@/presentation/controllers/invite'
import { Validation } from '@/presentation/protocols'
import { faker } from '@faker-js/faker'

const mockFakeRequest = (): any => ({
  body: {
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
  }
})

describe('CreateInvite Controller', () => {
  it('should call Validation with correct values', async () => {
    class ValidationStub implements Validation {
      validate (_input: any): Error | null {
        return null
      }
    }
    const validationStub = new ValidationStub()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const sut = new CreateInviteController(validationStub)
    const httpRequest = mockFakeRequest()
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
