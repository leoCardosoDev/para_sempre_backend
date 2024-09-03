import { CreateInvite } from '@/domain/usecases/invite'
import { badRequest } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class CreateInviteController implements Controller {
  constructor(
    private readonly _validation: Validation,
    private readonly _createInvite: CreateInvite
  ) {}

  async handle(request: CreateInviteControllerParams): Promise<HttpResponse> {
    const error = this._validation.validate(request)
    if (error) return badRequest(error)
    const inviteParams = {
      ...request,
      accountId: request.accountId,
      createdAt: new Date(request.createdAt),
      expiration: new Date(request.expiration),
      usedAt: request.usedAt ? new Date(request.usedAt) : null
    }
    await this._createInvite.create(inviteParams)
    return { statusCode: 200, body: {} } //temporario até terminar a feature
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
