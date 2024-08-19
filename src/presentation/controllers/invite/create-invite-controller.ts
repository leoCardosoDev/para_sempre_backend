import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class CreateInviteController implements Controller {
  constructor(private readonly _validation: Validation) {}
  async handle(request: CreateInviteControllerParams): Promise<HttpResponse> {
    this._validation.validate(request)
    return new Promise(resolve => resolve({ body: {}, statusCode: 0 }))
  }
}

export type CreateInviteControllerParams = {
  invite_id: string
  admin_id: string
  invite_code: string
  email_user: string
  phone_user: string
  status: string
  invite_type: string
  created_at: Date
  expiration: Date
  used_at: string | null
  max_uses: number
}
