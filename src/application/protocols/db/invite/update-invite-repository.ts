export interface UpdateInviteRepository {
  updateByCode: (_invite: UpdateInviteRepositoryParams) => Promise<UpdateInviteRepositoryResult>
}

export type UpdateInviteRepositoryParams = {
  inviteCode: string
  status: string
  expiration: Date
  usedAt: Date
  emailUser: string
  phoneUser: string
  inviteType: string
  maxUses: number
}

export type UpdateInviteRepositoryResult = boolean
