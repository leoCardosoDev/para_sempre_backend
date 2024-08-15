import { Controller, HttpResponse, Validation } from '@/presentation/protocols'
import { badRequest, serverError, unauthorized, ok } from '@/presentation/helpers'
import { Authentication } from '@/domain/usecases'
import { LoginControllerRequest } from './types'

export class LoginController implements Controller {
  constructor(
    private readonly _authentication: Authentication,
    private readonly _validation: Validation
  ) {}

  async handle(request: LoginControllerRequest): Promise<HttpResponse> {
    try {
      const error = this._validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const authenticationModel = await this._authentication.auth(request)
      if (!authenticationModel) {
        return unauthorized()
      }
      return ok(authenticationModel)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
