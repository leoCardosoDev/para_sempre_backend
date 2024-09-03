import { CreateInviteParams } from '@/domain/usecases/invite'
import { DbCreateInvite } from '@/application/usecases/invite'
import { CheckEmailRepositorySpy, CreateInviteRepositorySpy, InviteCodeGeneratorSpy, LoadInviteByCodeRepositorySpy } from '@/tests/application/mocks'
import { faker } from '@faker-js/faker'
import { EmailInUseError, InvalidExpirationDateError } from '@/domain/errors'

const mockInviteData = (): CreateInviteParams => ({
  accountId: faker.string.uuid(),
  inviteCode: 'unique_invite_code',
  emailUser: faker.internet.email(),
  phoneUser: faker.string.numeric({ length: { min: 10, max: 12 } }),
  status: faker.word.sample(),
  inviteType: faker.word.sample(),
  createdAt: faker.date.recent(),
  expiration: faker.date.future(),
  usedAt: null,
  maxUses: faker.number.int({ min: 0, max: 1 })
})

type SutTypes = {
  sut: DbCreateInvite
  checkEmailRepositorySpy: CheckEmailRepositorySpy
  loadByInviteCodeRepositorySpy: LoadInviteByCodeRepositorySpy
  createInviteRepositorySpy: CreateInviteRepositorySpy
  inviteCodeGenaratorSpy: InviteCodeGeneratorSpy
}

const makeSut = (): SutTypes => {
  const checkEmailRepositorySpy = new CheckEmailRepositorySpy()
  const loadByInviteCodeRepositorySpy = new LoadInviteByCodeRepositorySpy()
  const createInviteRepositorySpy = new CreateInviteRepositorySpy()
  const inviteCodeGenaratorSpy = new InviteCodeGeneratorSpy()
  const sut = new DbCreateInvite(checkEmailRepositorySpy, createInviteRepositorySpy, inviteCodeGenaratorSpy, loadByInviteCodeRepositorySpy)
  return {
    sut,
    checkEmailRepositorySpy,
    createInviteRepositorySpy,
    inviteCodeGenaratorSpy,
    loadByInviteCodeRepositorySpy
  }
}

describe('DbCreateInvite Usecase', () => {
  const setupMocks = (emailCheckResult: boolean, inviteCode: string, inviteDataOverride?: Partial<CreateInviteParams>) => {
    const { sut, checkEmailRepositorySpy, createInviteRepositorySpy, inviteCodeGenaratorSpy } = makeSut()
    jest.spyOn(checkEmailRepositorySpy, 'checkByEmail').mockResolvedValue(emailCheckResult)
    inviteCodeGenaratorSpy.generate.mockResolvedValue(inviteCode)
    const inviteData = { ...mockInviteData(), ...inviteDataOverride }
    return { sut, checkEmailRepositorySpy, createInviteRepositorySpy, inviteCodeGenaratorSpy, inviteData }
  }

  it('should generate a unique inviteCode and pass it to CreateInviteRepository', async () => {
    const { sut, createInviteRepositorySpy, inviteCodeGenaratorSpy, inviteData } = setupMocks(false, 'unique_invite_code')
    const createSpy = jest.spyOn(createInviteRepositorySpy, 'createInvite')
    await sut.create(inviteData)
    expect(inviteCodeGenaratorSpy.generate).toHaveBeenCalledTimes(1)
    expect(createSpy).toHaveBeenCalledWith({ ...inviteData, inviteCode: 'unique_invite_code' })
  })

  it('should call CreateInviteRepository with correct values', async () => {
    const { sut, createInviteRepositorySpy, inviteData } = setupMocks(false, 'unique_invite_code')
    const createSpy = jest.spyOn(createInviteRepositorySpy, 'createInvite')
    await sut.create(inviteData)
    expect(createSpy).toHaveBeenCalledWith({ ...inviteData, inviteCode: 'unique_invite_code' })
  })

  it('should allow invite creation if email does not exist', async () => {
    const { sut, createInviteRepositorySpy, inviteData } = setupMocks(false, 'unique_invite_code')
    const createSpy = jest.spyOn(createInviteRepositorySpy, 'createInvite')
    await sut.create(inviteData)
    expect(createSpy).toHaveBeenCalledWith({ ...inviteData, inviteCode: 'unique_invite_code' })
  })

  it('should not allow invite creation if email already exists', async () => {
    const { sut } = setupMocks(true, '')
    const inviteData = mockInviteData()
    const promise = sut.create(inviteData)
    await expect(promise).rejects.toThrow(new EmailInUseError())
  })

  it('should throw an error if expiration date is earlier than creation date', async () => {
    const { sut } = setupMocks(false, '', {
      createdAt: new Date('2024-01-01'),
      expiration: new Date('2023-12-31')
    })
    const inviteData = {
      ...mockInviteData(),
      createdAt: new Date('2024-01-01'),
      expiration: new Date('2023-12-31')
    }
    const promise = sut.create(inviteData)
    await expect(promise).rejects.toThrow(new InvalidExpirationDateError())
  })

  it('should generate a new inviteCode if the generated code already exists', async () => {
    const { sut, inviteCodeGenaratorSpy, loadByInviteCodeRepositorySpy } = makeSut()
    const inviteData = mockInviteData()
    const existingInvite = {
      inviteId: 'existing_invite_id',
      accountId: inviteData.accountId,
      inviteCode: 'duplicate_invite_code',
      emailUser: inviteData.emailUser,
      phoneUser: inviteData.phoneUser,
      status: inviteData.status,
      expiration: inviteData.expiration,
      usedAt: inviteData.usedAt
    }
    jest.spyOn(loadByInviteCodeRepositorySpy, 'loadByCode').mockResolvedValueOnce(existingInvite).mockResolvedValueOnce(null)
    jest.spyOn(inviteCodeGenaratorSpy, 'generate').mockResolvedValueOnce('duplicate_invite_code').mockResolvedValueOnce('unique_invite_code')
    await sut.create(inviteData)
    expect(inviteCodeGenaratorSpy.generate).toHaveBeenCalledTimes(2)
    expect(loadByInviteCodeRepositorySpy.loadByCode).toHaveBeenCalledWith('duplicate_invite_code')
    expect(loadByInviteCodeRepositorySpy.loadByCode).toHaveBeenCalledWith('unique_invite_code')
  })

  it('should return the created invite data', async () => {
    const { sut } = makeSut()
    const inviteData = mockInviteData()
    const createdInvite = { ...inviteData, inviteId: 'last_invite_id', inviteCode: 'unique_invite_code' }
    const result = await sut.create(inviteData)
    expect(result).toEqual(createdInvite)
  })
})
