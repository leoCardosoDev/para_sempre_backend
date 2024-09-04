import { EmailInUseError, InvalidExpirationDateError } from '@/domain/errors'
import { CreateInvite } from '@/domain/usecases/invite'
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
      if (error) return badRequest(error)
      const inviteParams = {
        ...request,
        accountId: request.accountId,
        createdAt: new Date(request.createdAt),
        expiration: new Date(request.expiration),
        usedAt: null
      }
      const result = await this._createInvite.create(inviteParams)
      return ok(result)
    } catch (error) {
      if (error instanceof EmailInUseError) return badRequest(error)
      if (error instanceof InvalidExpirationDateError) return badRequest(error)
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
  createdAt: string
  expiration: string
  usedAt?: string
  maxUses: number
}
