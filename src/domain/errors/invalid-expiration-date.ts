export class InvalidExpirationDateError extends Error {
  constructor() {
    super('Expiration must be greater than createdAt')
    this.name = 'InvalidExpirationDateError'
  }
}
