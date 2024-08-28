export interface LoadInviteByCode {
  load: (_params: LoadInviteByCodeParams) => Promise<LoadInviteByCodeResult>
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
  expiration: Date
} | null
