export interface LoadInviteByCode {
  loadByCode: (_params: LoadInviteByCodeParams) => Promise<LoadInviteByCodeResult>
}

export type LoadInviteByCodeParams = {
  inviteCode: string
}

export type LoadInviteByCodeResult = {
  accountId: string
  inviteCode: string
  emailUser: string
  phoneUser: string
  status: string
  inviteType: string
  createdAt: Date
  expiration: Date
  usedAt: Date | null
  maxUses: number
} | null
