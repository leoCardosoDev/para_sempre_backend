import { badRequest } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class UpdateInviteController implements Controller {
  constructor(private readonly _validation: Validation) {}
  async handle(request: UpdateInviteControllerParams): Promise<HttpResponse> {
    const error = this._validation.validate(request)
    if (error) return badRequest(error)
    return new Promise(resolve => resolve({ statusCode: 200, body: null }))
  }
}

export type UpdateInviteControllerParams = {
  inviteCode: string
  status: string
  createdAt: string
  expiration: string
  usedAt?: string
}
