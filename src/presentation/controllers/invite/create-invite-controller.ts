import { CreateInvite } from '@/domain/usecases/invite'
import { badRequest } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class CreateInviteController implements Controller {
  constructor(
    private readonly _validation: Validation,
    private readonly _createInvite: CreateInvite
  ) {}

  async handle(request: any): Promise<HttpResponse> {
    const error = this._validation.validate(request)
    if (error) return badRequest(error)
    await this._createInvite.create(request)
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
