import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols'

export const makeLoadInviteValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['inviteCode']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
