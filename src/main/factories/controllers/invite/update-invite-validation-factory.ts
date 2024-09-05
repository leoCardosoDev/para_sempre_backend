import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols'

export const makeUpdateInviteValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['inviteCode', 'status', 'createdAt', 'expiration', 'usedAt']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
