export interface LoadInviteByCodeRepository {
  loadByCode: (_inviteCode: string) => Promise<LoadInviteByCodeRepositoryResult>
}

export type LoadInviteByCodeRepositoryResult = {
  accountId: string
  inviteCode: string
  emailUser: string
  phoneUser: string
  status: string
  expiration: Date
} | null
