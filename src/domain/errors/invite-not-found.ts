export class InviteNotFoundError extends Error {
  constructor() {
    super('Invite not found')
    this.name = 'InviteNotFoundError'
  }
}
