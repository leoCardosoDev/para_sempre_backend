import { CreateInvite, CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

export class CreateInviteSpy implements CreateInvite {
  params: CreateInviteParams
  result = true

  async create (params: CreateInviteParams): Promise<CreateInviteResult> {
    this.params = params
    return this.result
  }
}


