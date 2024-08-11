import { Controller, HttpResponse, Validation } from '@/presentation/protocols'
import { badRequest, serverError, ok, forbidden } from '@/presentation/helpers'
import { EmailInUseError } from '@/presentation/errors'
import { CreateAccount, Authentication } from '@/domain/usecases'
import { SignUpControllerRequest } from './types'

export class SignUpController implements Controller {
  constructor(
    private readonly _createAccount: CreateAccount,
    private readonly _validation: Validation,
    private readonly _authentication: Authentication
  ) {}

  async handle(_request: SignUpControllerRequest): Promise<HttpResponse> {
    try {
      const error = this._validation.validate(_request)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = _request
      const isValid = await this._createAccount.create({
        name,
        email,
        password
      })
      if (!isValid) {
        return forbidden(new EmailInUseError())
      }
      const authenticationModel = await this._authentication.auth({
        email,
        password
      })
      return ok(authenticationModel)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
