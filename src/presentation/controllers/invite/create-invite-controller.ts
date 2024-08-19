import { CreateInvite } from '@/domain/usecases/invite'
import { InvalidParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class CreateInviteController implements Controller {
  constructor(
    private readonly _validation: Validation,
    private readonly _createInvite: CreateInvite
  ) {}

  async handle(request: CreateInviteControllerParams): Promise<HttpResponse> {
    const error = this._validation.validate(request)
    if (error) {
      return badRequest(error)
    }
    if (request.expiration <= request.createdAt) {
      return badRequest(new InvalidParamError('expiration must be greater than createdAt'))
    }
    const inviteData = { ...request, usedAt: null }
    await this._createInvite.create(inviteData)
    return new Promise(resolve => resolve({ body: {}, statusCode: 204 }))
  }
}

export type CreateInviteControllerParams = {
  inviteId: string
  adminId: string
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
