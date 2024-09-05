import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols'
import { EmailValidatorAdapter } from '@/infra/validators'

export const makeCreateInviteValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['emailUser', 'phoneUser', 'status', 'inviteType', 'createdAt', 'expiration', 'maxUses']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('emailUser', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
