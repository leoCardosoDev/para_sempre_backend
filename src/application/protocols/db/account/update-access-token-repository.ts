export interface UpdateAccessTokenRepository {
  updateAccessToken: (_id: string, _token: string) => Promise<void>
}
