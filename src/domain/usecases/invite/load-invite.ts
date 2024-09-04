export interface LoadInvite {
  load: (_code: LoadInviteParams) => Promise<LoadInviteResult>
}

export type LoadInviteParams = {
  code: string
}

export type LoadInviteResult = {
  inviteId: string
  accountId: string
  inviteCode: string
  emailUser: string
  phoneUser: string
  status: string
  expiration: Date
  usedAt: Date | null
} | null
