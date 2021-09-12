import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'
import { mock, MockProxy } from 'jest-mock-extended'
import { LoadFacebookUserApi } from '@/data/contracts/apis'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserByTokenApi: MockProxy<LoadFacebookUserApi>
  let sut: FacebookAuthenticationService

  beforeEach(() => {
    loadFacebookUserByTokenApi = mock()
    sut = new FacebookAuthenticationService(loadFacebookUserByTokenApi)
  })
  it('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserByTokenApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserByTokenApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const authResult = await sut.execute({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
