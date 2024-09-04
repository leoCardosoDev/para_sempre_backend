import { LoadInvite } from '@/domain/usecases'
import { NotFoundError } from '@/presentation/errors'
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class LoadInviteController implements Controller {
  constructor(
    private readonly _validation: Validation,
    private readonly _loadInvite: LoadInvite
  ) {}
  async handle(request: LoadInviteControllerParams): Promise<HttpResponse> {
    try {
      const error = this._validation.validate(request)
      if (error) return badRequest(error)
      const invite = await this._loadInvite.load(request)
      if (!invite) return notFound(new NotFoundError())
      return ok(invite)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export type LoadInviteControllerParams = {
  inviteCode: string
}
