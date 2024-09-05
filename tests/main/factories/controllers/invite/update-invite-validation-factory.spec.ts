import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols'
import { makeUpdateInviteValidation } from '@/main/factories/controllers/invite'

jest.mock('@/validation/validators/validation-composite')

describe('LoadInviteValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeUpdateInviteValidation()
    const validations: Validation[] = []
    for (const field of ['inviteCode', 'status', 'createdAt', 'expiration', 'usedAt', 'emailUser', 'phoneUser', 'inviteType', 'maxUses']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
