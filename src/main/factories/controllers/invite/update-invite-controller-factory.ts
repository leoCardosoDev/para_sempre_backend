import { UpdateInviteController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeDbLoadInviteCode } from '@/main/factories/'
import { makeDbUpdateInviteCode } from '@/main/factories/usecases'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeUpdateInviteValidation } from './update-invite-validation-factory'

export const makeUpdateInviteController = (): Controller => {
  const controller = new UpdateInviteController(makeUpdateInviteValidation(), makeDbLoadInviteCode(), makeDbUpdateInviteCode())
  return makeLogControllerDecorator(controller)
}
