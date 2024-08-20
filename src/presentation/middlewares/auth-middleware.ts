import { Middleware, HttpResponse } from '@/presentation/protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { AccessDeniedError } from '@/presentation/errors'
import { LoadAccountByToken } from '@/domain/usecases'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly _loadAccountByToken: LoadAccountByToken,
    private readonly _role?: string
  ) {}

  async handle(request: AuthMiddlewareRequest): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (accessToken) {
        const account = await this._loadAccountByToken.load(accessToken, this._role)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export type AuthMiddlewareRequest = {
  accessToken?: string
}
