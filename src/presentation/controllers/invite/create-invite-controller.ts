import { CreateInvite } from '@/domain/usecases/invite'
import { InvalidParamError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class CreateInviteController implements Controller {
  constructor(
    private readonly _validation: Validation,
    private readonly _createInvite: CreateInvite
  ) {}

  async handle(request: CreateInviteControllerParams): Promise<HttpResponse> {
    try {
      const error = this._validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      if (request.expiration <= request.createdAt) {
        return badRequest(new InvalidParamError('expiration must be greater than createdAt'))
      }
      const inviteData = { ...request, accountId: request.accountId, usedAt: null }
      const result = await this._createInvite.create(inviteData)
      return ok(result)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export type CreateInviteControllerParams = {
  accountId: string
  inviteCode: string
  emailUser: string
  phoneUser: string
  status: string
  inviteType: string
  createdAt: Date
  expiration: Date
  usedAt: Date | null
  maxUses: number
}
