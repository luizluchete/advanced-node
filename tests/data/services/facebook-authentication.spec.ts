import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'
import { mock, MockProxy } from 'jest-mock-extended'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserByTokenApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let createFacebookAccountRepo: MockProxy<CreateFacebookAccountRepository>
  let sut: FacebookAuthenticationService

  const token = 'any_token'

  beforeEach(() => {
    loadFacebookUserByTokenApi = mock()
    loadFacebookUserByTokenApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })

    loadUserAccountRepo = mock()
    createFacebookAccountRepo = mock()
    sut = new FacebookAuthenticationService(
      loadFacebookUserByTokenApi,
      loadUserAccountRepo,
      createFacebookAccountRepo
    )
  })
  it('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.execute({ token })

    expect(loadFacebookUserByTokenApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserByTokenApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserByTokenApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.execute({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('Should call LoadUserAccountRepo when LoadFacebookApi return data', async () => {
    await sut.execute({ token })
    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should call CreateUserAccountRepo when LoadFacebookApi return undefied', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined)
    await sut.execute({ token })

    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
