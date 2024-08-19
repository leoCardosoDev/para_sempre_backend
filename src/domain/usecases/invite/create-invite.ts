export interface CreateInvite {
  create: (_invite: CreateInviteParams) => Promise<CreateInviteResult>
}

export type CreateInviteParams = {
  inviteId: string
  adminId: string
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

export type CreateInviteResult = boolean
