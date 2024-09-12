export interface CreateAccountWithInvite {
  create: (_account: CreateAccountWithInviteParams) => Promise<CreateAccountWithInviteResult>
}

export type CreateAccountWithInviteParams = {
  name: string
  email: string
  password: string
  inviteCode: string
  inviteId?: string
  status: 'pending' | 'active' | 'desactive'
}

export type CreateAccountWithInviteResult = {
  success: boolean
  inviteId?: string
  error?: string[]
}
