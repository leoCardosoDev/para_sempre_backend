export type SignUpControllerRequest = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export type LoginControllerRequest = {
  email: string
  password: string
}
