import { makeDbCreateInvite, makeLogControllerDecorator } from '@/main/factories'
import { CreateInviteController } from '@/presentation/controllers'

import { Controller } from '@/presentation/protocols'
import { makeCreateInviteValidation } from './create-invite-validation-factory'

export const makeCreateInviteController = (): Controller => {
  const controller = new CreateInviteController(makeCreateInviteValidation(), makeDbCreateInvite())
  return makeLogControllerDecorator(controller)
}
