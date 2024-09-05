import { AuthenticationParams } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export const mockAccountParams = (): any => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
