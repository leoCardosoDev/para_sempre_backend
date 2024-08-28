export interface CreateAccount {
  create: (_account: CreateAccountParams) => Promise<CreateAccountResult>
}

export type CreateAccountParams = {
  name: string
  email: string
  password: string
}

export type CreateAccountResult = boolean
