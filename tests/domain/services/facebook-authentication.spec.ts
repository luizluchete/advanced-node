import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repos'
import { AcessToken, FacebookAccount } from '@/domain/models'
import { FacebookAuthenticationService } from '@/domain/services'
import { TokenGenerator } from '@/domain/contracts/crypto'

import { mocked } from 'ts-jest/utils'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let crypto: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let sut: FacebookAuthenticationService
  let token: string

  beforeAll(() => {
    token = 'any_token'
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })

    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })

    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo,
      crypto
    )
  })
  it('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.execute({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.execute({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('Should call LoadUserAccountRepo when LoadFacebookApi return data', async () => {
    await sut.execute({ token })
    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub)
    await sut.execute({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('Should call TokenGenerator with correct params', async () => {
    await sut.execute({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AcessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  it('Should return as AcessToken on sucess', async () => {
    const authResult = await sut.execute({ token })

    expect(authResult).toEqual(new AcessToken('any_generated_token'))
  })

  it('Should rethrow LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))
    const promise = sut.execute({ token })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  it('Should rethrow LoadUserAccountRepository throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut.execute({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('Should rethrow SaveFacebookAccountRepository throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut.execute({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('Should rethrow TokenGenerator throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('token_error'))

    const promise = sut.execute({ token })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
