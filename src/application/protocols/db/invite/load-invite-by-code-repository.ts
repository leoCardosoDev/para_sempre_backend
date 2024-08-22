import { LoadInviteByCodeParams, LoadInviteByCodeResult } from '@/domain/usecases/invite'

export interface LoadInviteByCodeRepository {
  loadByCode: (_params: LoadInviteByCodeParams) => Promise<LoadInviteByCodeResult>
}
