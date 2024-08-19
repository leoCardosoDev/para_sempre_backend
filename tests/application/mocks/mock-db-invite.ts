import { CreateInviteRepository } from '@/application/protocols/db/invite'
import { CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

export class CreateInviteRepositorySpy implements CreateInviteRepository {
  async create (_invateData: CreateInviteParams): Promise<CreateInviteResult> {
    return new Promise(resolve => resolve(true))
  }
}
