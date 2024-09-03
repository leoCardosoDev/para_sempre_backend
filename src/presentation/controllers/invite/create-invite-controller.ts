import { badRequest } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class CreateInviteController implements Controller {
  constructor(private readonly _validation: Validation) {}

  async handle(request: any): Promise<HttpResponse> {
    const error = this._validation.validate(request)
    if (error) return badRequest(error)
    return new Promise(resolve => resolve({ statusCode: 200, body: {} })) //temporario até terminar a feature
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
