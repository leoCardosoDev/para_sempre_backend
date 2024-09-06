import { AuthenticationParams, CreateAccountWithInvite, CreateAccountWithInviteParams, CreateAccountWithInviteResult } from '@/domain/usecases'
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

export class CreateAccountWithInviteSpy implements CreateAccountWithInvite {
  public params: CreateAccountWithInviteParams | undefined
  public result: CreateAccountWithInviteResult = { success: true }
  async create(account: CreateAccountWithInviteParams): Promise<CreateAccountWithInviteResult> {
    this.params = account
    return this.result
  }
}
