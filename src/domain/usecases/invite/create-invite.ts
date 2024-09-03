export interface CreateInvite {
  create: (_invite: CreateInviteParams) => Promise<CreateInviteResult>
}

export type CreateInviteParams = {
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
}

export type CreateInviteResult = {
  inviteId: string
  inviteCode: string
  status: string
  emailUser: string
  usedAt: Date | null
  expiration: Date
} | null
