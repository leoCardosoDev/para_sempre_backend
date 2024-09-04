import { badRequest } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class LoadInviteController implements Controller {
  constructor(private readonly _validation: Validation) {}
  async handle(request: LoadInviteControllerParams): Promise<HttpResponse> {
    const error = this._validation.validate(request)
    if (error) return badRequest(error)
    return new Promise(resolve => resolve({ statusCode: 200, body: null }))
  }
}

export type LoadInviteControllerParams = {
  inviteCode: string
}
