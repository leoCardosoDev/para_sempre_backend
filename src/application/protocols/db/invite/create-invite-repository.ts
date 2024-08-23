import { CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

export interface CreateInviteRepository {
  createInvite: (_invateData: CreateInviteParams) => Promise<CreateInviteResult>
}
