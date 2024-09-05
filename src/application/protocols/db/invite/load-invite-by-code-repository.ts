export interface LoadInviteByCodeRepository {
  loadByCode: (_inviteCode: string) => Promise<LoadInviteByCodeRepositoryResult>
}

export type LoadInviteByCodeRepositoryResult = {
  inviteId: string
  accountId: string
  inviteCode: string
  emailUser: string
  phoneUser: string
  status: string
  expiration: Date
  usedAt: Date | null
} | null
