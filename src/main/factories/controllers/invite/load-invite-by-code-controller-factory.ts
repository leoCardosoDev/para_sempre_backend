import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { LoadInviteByCodeController } from '@/presentation/controllers/invite'
import { makeLoadInviteByCodeValidation } from './load-invite-by-code-validation-factory'
import { makeDbLoadInviteByCode } from '@/main/factories/'

export const makeLoadInvitebyCodeController = (): Controller => {
  const controller = new LoadInviteByCodeController(makeLoadInviteByCodeValidation(), makeDbLoadInviteByCode())
  return makeLogControllerDecorator(controller)
}
