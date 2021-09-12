import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'
import { mock } from 'jest-mock-extended'
import { LoadFacebookUserApi } from '@/data/contracts/apis'

describe('FacebookAuthenticationService', () => {
  it('Should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserByTokenApi = mock<LoadFacebookUserApi>()

    const sut = new FacebookAuthenticationService(loadFacebookUserByTokenApi)
    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserByTokenApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserByTokenApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserByTokenApi = mock<LoadFacebookUserApi>()

    loadFacebookUserByTokenApi.loadUser.mockResolvedValueOnce(undefined)
    const sut = new FacebookAuthenticationService(loadFacebookUserByTokenApi)
    const authResult = await sut.execute({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
