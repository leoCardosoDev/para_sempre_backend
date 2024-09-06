export interface CreateAccountWithInvite {
  create: (_account: CreateAccountWithInviteParams) => Promise<CreateAccountWithInviteResult>
}

export type CreateAccountWithInviteParams = {
  name: string
  email: string
  password: string
  inviteCode: string
  inviteId?: string
}

export type CreateAccountWithInviteResult = {
  success: boolean
  inviteId?: string
  error?: string
}
