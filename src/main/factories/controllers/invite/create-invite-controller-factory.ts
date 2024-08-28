import { CreateInviteController } from '@/presentation/controllers/invite'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbCreateInvite } from '@/main/factories/usecases/create-invite-factory'
import { makeCreateInviteValidation } from './create-invite-validation-factory'

export const makeCreateInviteController = (): Controller => {
  const controller = new CreateInviteController(makeCreateInviteValidation(), makeDbCreateInvite())
  return makeLogControllerDecorator(controller)
}
