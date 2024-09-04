import { LoadInviteController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeLoadInviteValidation } from './load-invite-validation-factory'
import { makeDbLoadInviteCode, makeLogControllerDecorator } from '@/main/factories'

export const makeLoadInviteController = (): Controller => {
  const controller = new LoadInviteController(makeLoadInviteValidation(), makeDbLoadInviteCode())
  return makeLogControllerDecorator(controller)
}
