import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class CreateInviteController implements Controller {
  constructor(private readonly _validation: Validation) {}
  async handle(_request: any): Promise<HttpResponse> {
    this._validation.validate(_request.body)
    return new Promise(resolve => resolve({ body: {}, statusCode: 0 }))
  }
}
