import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const makeLoadInviteByCodeValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['inviteCode']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
