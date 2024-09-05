export interface UpdateInvite {
  update: (_params: UpdateInviteParams) => Promise<UpdateInviteResult>
}

export type UpdateInviteParams = {
  inviteCode: string
  status: string
  expiration: Date
  usedAt: Date
  emailUser: string
  phoneUser: string
  inviteType: string
  maxUses: number
}

export type UpdateInviteResult = boolean
