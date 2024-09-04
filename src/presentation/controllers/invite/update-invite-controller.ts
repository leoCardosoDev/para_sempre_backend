import { LoadInvite, UpdateInvite } from '@/domain/usecases'
import { NotFoundError } from '@/presentation/errors'
import { badRequest, notFound } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class UpdateInviteController implements Controller {
  constructor(
    private readonly _validation: Validation,
    private readonly _loadInvite: LoadInvite,
    private readonly _updateInvite: UpdateInvite
  ) {}
  async handle(request: UpdateInviteControllerParams): Promise<HttpResponse> {
    const error = this._validation.validate(request)
    if (error) return badRequest(error)
    const loadInvite = await this._loadInvite.load({ inviteCode: request.inviteCode })
    if (!loadInvite) return notFound(new NotFoundError())
    const inviteUpdateData = {
      inviteCode: request.inviteCode,
      status: request.status,
      createdAt: new Date(request.createdAt),
      expiration: new Date(request.expiration),
      usedAt: new Date()
    }
    await this._updateInvite.update(inviteUpdateData)
    return new Promise(resolve => resolve({ statusCode: 200, body: null }))
  }
}

export type UpdateInviteControllerParams = {
  inviteCode: string
  status: string
  createdAt: string
  expiration: string
  usedAt: string
}
