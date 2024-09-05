export class EmailInUseError extends Error {
  constructor() {
    super('Email already exists')
    this.name = 'EmailInUseError'
  }
}
