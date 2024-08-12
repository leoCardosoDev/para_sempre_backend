import { AuthenticationParams, CreateAccountParams } from '@/domain/types'

import { faker } from '@faker-js/faker'

export const mockAccountParams = (): CreateAccountParams => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
