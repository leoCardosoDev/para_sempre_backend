import { LoadInvite } from '@/domain/usecases'
import { NotFoundError } from '@/presentation/errors'
import { badRequest, notFound } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class UpdateInviteController implements Controller {
  constructor(
    private readonly _validation: Validation,
    private readonly _loadInvite: LoadInvite
  ) {}
  async handle(request: UpdateInviteControllerParams): Promise<HttpResponse> {
    const error = this._validation.validate(request)
    if (error) return badRequest(error)
    const loadInvite = await this._loadInvite.load(request)
    if (!loadInvite) return notFound(new NotFoundError())
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
