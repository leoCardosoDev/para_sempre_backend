import { LoadInviteByCode } from '@/domain/usecases/invite'
import { badRequest, ok, serverError } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class LoadInviteByCodeController implements Controller {
  constructor(
    private readonly _validation: Validation,
    private readonly _loadInvite: LoadInviteByCode
  ) {}

  async handle(request: LoadInviteByCodeControllerParams): Promise<HttpResponse> {
    try {
      const error = this._validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const result = await this._loadInvite.load(request)
      return ok(result)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export type LoadInviteByCodeControllerParams = {
  inviteCode: string
}
