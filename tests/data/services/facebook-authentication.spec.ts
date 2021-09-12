import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationService } from '@/data/services'

class LoadFacebookUserSpy implements LoadFacebookUserApi {
  token?: string
  result = undefined
  callsCount = 0
  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    this.callsCount++
    return this.result
  }
}

describe('FacebookAuthenticationService', () => {
  it('Should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserByTokenApi = new LoadFacebookUserSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserByTokenApi)
    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserByTokenApi.token).toBe('any_token')
    expect(loadFacebookUserByTokenApi.callsCount).toBe(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserByTokenApi = new LoadFacebookUserSpy()
    loadFacebookUserByTokenApi.result = undefined
    const sut = new FacebookAuthenticationService(loadFacebookUserByTokenApi)
    const authResult = await sut.execute({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
