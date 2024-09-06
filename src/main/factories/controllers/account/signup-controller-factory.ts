import { makeDbAuthentication, makeSignUpValidation, makeLogControllerDecorator, makeDbCreateAccountWithInvite } from '@/main/factories'
import { SignUpController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbCreateAccountWithInvite(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
