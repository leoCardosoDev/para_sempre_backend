import { CreateInviteParams, CreateInviteResult } from '@/domain/usecases/invite'

export interface CreateInviteRepository {
  create: (_invateData: CreateInviteParams) => Promise<CreateInviteResult>
}
