import { AuthenticationParams, CreateAccountWithInviteParams } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export const mockAccountWithInviteParams = (): CreateAccountWithInviteParams => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  inviteCode: faker.internet.password()
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
