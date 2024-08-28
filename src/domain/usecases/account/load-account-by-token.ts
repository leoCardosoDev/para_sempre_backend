export interface LoadAccountByToken {
  load: (_accessToken: string, _role?: string) => Promise<LoadAccountByTokenResult>
}

export type LoadAccountByTokenResult = {
  id: string
} | null
