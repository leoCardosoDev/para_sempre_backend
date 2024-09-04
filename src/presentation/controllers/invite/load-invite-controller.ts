import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class LoadInviteController implements Controller {
  constructor(private readonly _validation: Validation) {}
  async handle(request: LoadInviteControllerParams): Promise<HttpResponse> {
    this._validation.validate(request)
    return new Promise(resolve => resolve({ statusCode: 200, body: null }))
  }
}

export type LoadInviteControllerParams = {
  inviteCode: string
}
