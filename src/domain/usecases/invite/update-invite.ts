export interface UpdateInvite {
  update: (_params: UpdateInviteParams) => Promise<UpdateInviteResult>
}

export type UpdateInviteParams = {
  inviteCode: string
  status: string
  expiration: Date
  usedAt: Date
}

export type UpdateInviteResult = boolean
