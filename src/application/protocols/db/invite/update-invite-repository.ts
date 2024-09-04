export interface UpdateInviteRepository {
  updateByCode: (_invite: UpdateInviteRepositoryParams) => Promise<UpdateInviteRepositoryResult>
}

export type UpdateInviteRepositoryParams = {
  inviteCode: string
  status: string
  expiration: Date
  usedAt: Date
}

export type UpdateInviteRepositoryResult = boolean
