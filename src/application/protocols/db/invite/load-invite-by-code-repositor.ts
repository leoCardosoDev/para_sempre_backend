import { LoadInviteByCodeParams, LoadInviteByCodeResult } from '@/domain/usecases/invite'

export interface LoadInviteByCodeRepository {
  loadByCode: (_param: LoadInviteByCodeParams) => Promise<LoadInviteByCodeResult>
}
