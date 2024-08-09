import { CreateAccountParams } from "@/domain/types";

import { faker } from '@faker-js/faker'

export const mockAccountParams = (): CreateAccountParams => ({
  name: faker.person.fullName.name,
  email: faker.internet.email.name,
  password: faker.internet.password.name
})
