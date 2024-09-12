import { Controller, HttpResponse, Validation } from '@/presentation/protocols'
import { badRequest, serverError, ok, forbidden } from '@/presentation/helpers'
import { CreateAccountWithInvite, Authentication } from '@/domain/usecases'
import { CustomError } from '@/presentation/errors/custom-error'

export class SignUpController implements Controller {
  constructor(
    private readonly _createAccount: CreateAccountWithInvite,
    private readonly _validation: Validation,
    private readonly _authentication: Authentication
  ) {}

  async handle(_request: SignUpControllerRequest): Promise<HttpResponse> {
    try {
      const error = this._validation.validate(_request)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password, inviteCode } = _request
      const result = await this._createAccount.create({
        name,
        email,
        password,
        inviteCode,
        status: 'pending'
      })
      if (!result.success) {
        const errorMessages = result.error
        const errorMessage = errorMessages && errorMessages.length > 0 ? errorMessages[0] : 'Unknown error'
        return forbidden(new CustomError(errorMessage))
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

export type SignUpControllerRequest = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  inviteCode: string
}
